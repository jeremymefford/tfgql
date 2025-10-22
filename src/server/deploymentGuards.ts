import {
  defaultFieldResolver,
  GraphQLError,
  type DirectiveNode,
  type DocumentNode,
  type GraphQLFieldResolver,
  type ObjectTypeDefinitionNode,
  type ObjectTypeExtensionNode,
  visit,
} from "graphql";
import type { Context } from "./context";

type FieldRestriction = "tfeOnly" | "tfcOnly";
type FieldRestrictionMap = Map<string, Map<string, FieldRestriction>>;

export function applyDeploymentTargetGuards(
  documents: DocumentNode[],
  targetResolvers: Record<string, any>,
): void {
  const restrictions = collectFieldRestrictions(documents);
  for (const [typeName, fieldMap] of restrictions) {
    if (fieldMap.size === 0) {
      continue;
    }

    const typeResolvers = (targetResolvers[typeName] =
      targetResolvers[typeName] ?? Object.create(null));

    for (const [fieldName, restriction] of fieldMap) {
      const existingResolver = typeResolvers[fieldName];
      const wrappedResolver = wrapWithRestriction(
        typeName,
        fieldName,
        existingResolver,
        restriction,
      );
      typeResolvers[fieldName] = wrappedResolver;
    }
  }
}

function collectFieldRestrictions(
  documents: DocumentNode[],
): FieldRestrictionMap {
  const fieldMap: FieldRestrictionMap = new Map();

  const recordFields = (
    node: ObjectTypeDefinitionNode | ObjectTypeExtensionNode,
  ) => {
    if (!node.fields || node.fields.length === 0) {
      return;
    }

    const typeName = node.name.value;
    const typeRestriction = extractRestriction(
      node.directives,
      `type "${typeName}"`,
    );

    for (const field of node.fields) {
      const fieldName = field.name.value;
      const fieldLocation = `field "${typeName}.${fieldName}"`;
      const fieldRestriction = extractRestriction(
        field.directives,
        fieldLocation,
      );

      if (
        fieldRestriction &&
        typeRestriction &&
        fieldRestriction !== typeRestriction
      ) {
        throw new Error(
          `Conflicting deployment directives on ${fieldLocation}: cannot combine @${typeRestriction} with @${fieldRestriction}.`,
        );
      }

      const restriction = fieldRestriction ?? typeRestriction;
      if (!restriction) {
        continue;
      }

      let typeFieldMap = fieldMap.get(typeName);
      if (!typeFieldMap) {
        typeFieldMap = new Map();
        fieldMap.set(typeName, typeFieldMap);
      }
      typeFieldMap.set(fieldName, restriction);
    }
  };

  for (const document of documents) {
    visit(document, {
      ObjectTypeDefinition(node) {
        recordFields(node);
        return false;
      },
      ObjectTypeExtension(node) {
        recordFields(node);
        return false;
      },
    });
  }

  return fieldMap;
}

function extractRestriction(
  directives: readonly DirectiveNode[] | undefined,
  location: string,
): FieldRestriction | undefined {
  if (!directives || directives.length === 0) {
    return undefined;
  }

  let restriction: FieldRestriction | undefined;
  for (const directive of directives) {
    const name = directive.name.value;
    if (name !== "tfeOnly" && name !== "tfcOnly") {
      continue;
    }

    const current = name as FieldRestriction;
    if (restriction && restriction !== current) {
      throw new Error(
        `Conflicting deployment directives on ${location}: cannot combine @${restriction} with @${current}.`,
      );
    }
    restriction = current;
  }

  return restriction;
}

function wrapWithRestriction(
  typeName: string,
  fieldName: string,
  resolverCandidate: unknown,
  restriction: FieldRestriction,
): unknown {
  const fieldPath = `${typeName}.${fieldName}`;

  if (
    resolverCandidate &&
    typeof resolverCandidate === "object" &&
    "resolve" in (resolverCandidate as Record<string, unknown>) &&
    typeof (resolverCandidate as Record<string, unknown>).resolve === "function"
  ) {
    const candidateObject = resolverCandidate as Record<string, unknown>;
    return {
      ...candidateObject,
      resolve: createRestrictionGuard(
        fieldPath,
        candidateObject.resolve as GraphQLFieldResolver<unknown, Context>,
        restriction,
      ),
    };
  }

  const baseResolver: GraphQLFieldResolver<unknown, Context> =
    typeof resolverCandidate === "function"
      ? (resolverCandidate as GraphQLFieldResolver<unknown, Context>)
      : defaultFieldResolver;

  return createRestrictionGuard(fieldPath, baseResolver, restriction);
}

function createRestrictionGuard(
  fieldPath: string,
  resolver: GraphQLFieldResolver<unknown, Context>,
  restriction: FieldRestriction,
): GraphQLFieldResolver<unknown, Context> {
  return function deploymentRestrictedResolver(
    this: unknown,
    source,
    args,
    context,
    info,
  ) {
    const isTfcTarget = context.deploymentTarget === "tfc";
    const disallowed =
      (restriction === "tfeOnly" && isTfcTarget) ||
      (restriction === "tfcOnly" && !isTfcTarget);

    if (disallowed) {
      const expected =
        restriction === "tfeOnly" ? "Terraform Enterprise" : "Terraform Cloud";
      const code =
        restriction === "tfeOnly" ? "TFE_ONLY_ENDPOINT" : "TFC_ONLY_ENDPOINT";

      context.logger.warn(
        { field: fieldPath, deploymentTarget: context.deploymentTarget },
        `${restriction === "tfeOnly" ? "TFE" : "TFC"}-restricted GraphQL field invoked on incompatible deployment`,
      );

      throw new GraphQLError(
        `${info.parentType.name}.${info.fieldName} is only available when targeting ${expected}`,
        {
          extensions: {
            code,
            http: { status: 403 },
          },
        },
      );
    }

    return resolver.call(this, source, args, context, info);
  };
}
