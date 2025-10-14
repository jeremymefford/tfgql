import { gql } from "graphql-tag";
import {
  defaultFieldResolver,
  GraphQLError,
  type DocumentNode,
  type GraphQLFieldResolver,
  type ObjectTypeDefinitionNode,
  type ObjectTypeExtensionNode,
  visit,
} from "graphql";
import { DateTimeScalar } from "../common/scalars/dateTime";
import { resolvers as organizationsResolvers } from "../organizations/resolvers";
import { resolvers as workspacesResolvers } from "../workspaces/resolvers";
import { resolvers as usersResolvers } from "../users/resolvers";
import { resolvers as runsResolvers } from "../runs/resolvers";
import { resolvers as teamsResolvers } from "../teams/resolvers";
import { resolvers as configurationVersionResolvers } from "../configurationVersions/resolvers";
import { resolvers as variableSetResolvers } from "../variableSets/resolvers";
import { resolvers as projectsResolvers } from "../projects/resolvers";
import { resolvers as variableResolvers } from "../variables/resolvers";
import { resolvers as workspaceResourceResolvers } from "../workspaceResources/resolvers";
import { resolvers as agentPoolsResolvers } from "../agentPools/resolvers";
import { resolvers as agentTokensResolvers } from "../agentTokens/resolvers";
import { resolvers as agentsResolvers } from "../agents/resolvers";
import { resolvers as appliesResolvers } from "../applies/resolvers";
import { resolvers as assessmentResultsResolvers } from "../assessmentResults/resolvers";
import { resolvers as commentsResolvers } from "../comments/resolvers";
import { resolvers as organizationMembershipsResolvers } from "../organizationMemberships/resolvers";
import { resolvers as organizationTagsResolvers } from "../organizationTags/resolvers";
import { resolvers as plansResolvers } from "../plans/resolvers";
import { resolvers as policiesResolvers } from "../policies/resolvers";
import { resolvers as policySetsResolvers } from "../policySets/resolvers";
import { resolvers as policyEvaluationsResolvers } from "../policyEvaluations/resolvers";
import { resolvers as policySetParametersResolvers } from "../policySetParameters/resolvers";
import { resolvers as projectTeamAccessResolvers } from "../projectTeamAccess/resolvers";
import { resolvers as stateVersionOutputsResolvers } from "../stateVersionOutputs/resolvers";
import { resolvers as stateVersionsResolvers } from "../stateVersions/resolvers";
import { resolvers as runTriggersResolvers } from "../runTriggers/resolvers";
import { resolvers as teamTokensResolvers } from "../teamTokens/resolvers";
import { resolvers as teamAccessResolvers } from "../workspaceTeamAccess/resolvers";
import { resolvers as explorerResolvers } from "../explorer/resolvers";
import type { Context } from "./context";
import configurationVersionSchema from "../configurationVersions/schema";
import organizationSchema from "../organizations/schema";
import workspaceSchema from "../workspaces/schema";
import userSchema from "../users/schema";
import runSchema from "../runs/schema";
import teamSchema from "../teams/schema";
import filterSchema from "../common/filtering/schema";
import variableSetSchema from "../variableSets/schema";
import variableSchema from "../variables/schema";
import projectsSchema from "../projects/schema";
import workspaceResourcesSchema from "../workspaceResources/schema";
import agentPoolsSchema from "../agentPools/schema";
import agentTokensSchema from "../agentTokens/schema";
import agentSchema from "../agents/schema";
import appliesSchema from "../applies/schema";
import assessmentResultsSchema from "../assessmentResults/schema";
import commentsSchema from "../comments/schema";
import organizationMembershipsSchema from "../organizationMemberships/schema";
import organizationTagsSchema from "../organizationTags/schema";
import plansSchema from "../plans/schema";
import policiesSchema from "../policies/schema";
import policySetsSchema from "../policySets/schema";
import policyEvaluationsSchema from "../policyEvaluations/schema";
import policySetParametersSchema from "../policySetParameters/schema";
import projectTeamAccessSchema from "../projectTeamAccess/schema";
import stateVersionOutputsSchema from "../stateVersionOutputs/schema";
import runTriggersSchema from "../runTriggers/schema";
import teamTokensSchema from "../teamTokens/schema";
import teamAccessSchema from "../workspaceTeamAccess/schema";
import stateVersionsSchema from "../stateVersions/schema";
import explorerSchema from "../explorer/schema";

// Base schema definitions for root types and custom scalar
const baseSchema = gql`
  directive @tfeOnly on FIELD_DEFINITION | OBJECT

  scalar DateTime

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

/** Combined type definitions for the schema */
export const typeDefs = [
  baseSchema,
  filterSchema,
  userSchema,
  teamSchema,
  organizationSchema,
  workspaceSchema,
  runSchema,
  configurationVersionSchema,
  variableSetSchema,
  variableSchema,
  projectsSchema,
  workspaceResourcesSchema,
  agentPoolsSchema,
  agentTokensSchema,
  agentSchema,
  appliesSchema,
  assessmentResultsSchema,
  commentsSchema,
  organizationMembershipsSchema,
  organizationTagsSchema,
  plansSchema,
  policiesSchema,
  policySetsSchema,
  policyEvaluationsSchema,
  policySetParametersSchema,
  projectTeamAccessSchema,
  stateVersionOutputsSchema,
  stateVersionsSchema,
  runTriggersSchema,
  teamTokensSchema,
  teamAccessSchema,
  explorerSchema,
];

/** Combined resolvers for all types (queries, mutations, and custom scalars) */
const baseResolvers = {
  DateTime: DateTimeScalar,
  Query: {
    ...usersResolvers.Query,
    ...teamsResolvers.Query,
    ...organizationsResolvers.Query,
    ...workspacesResolvers.Query,
    ...runsResolvers.Query,
    ...configurationVersionResolvers.Query,
    ...variableSetResolvers.Query,
    ...variableResolvers.Query,
    ...projectsResolvers.Query,
    ...workspaceResourceResolvers.Query,
    ...agentPoolsResolvers.Query,
    ...agentTokensResolvers.Query,
    ...agentsResolvers.Query,
    ...appliesResolvers.Query,
    ...assessmentResultsResolvers.Query,
    ...commentsResolvers.Query,
    ...organizationMembershipsResolvers.Query,
    ...organizationTagsResolvers.Query,
    ...plansResolvers.Query,
    ...policiesResolvers.Query,
    ...policySetsResolvers.Query,
    ...policyEvaluationsResolvers.Query,
    ...policySetParametersResolvers.Query,
    ...projectTeamAccessResolvers.Query,
    ...stateVersionOutputsResolvers.Query,
    ...stateVersionsResolvers.Query,
    ...runTriggersResolvers.Query,
    ...teamTokensResolvers.Query,
    ...teamAccessResolvers.Query,
    ...explorerResolvers.Query,
  },
  Organization: {
    ...organizationsResolvers.Organization,
  },
  Workspace: {
    ...workspacesResolvers.Workspace,
  },
  Team: {
    ...teamsResolvers.Team,
  },
  Run: {
    ...runsResolvers.Run,
  },
  Plan: {
    ...plansResolvers.Plan,
  },
  PolicySet: {
    ...policySetsResolvers.PolicySet,
  },
  VariableSet: {
    ...variableSetResolvers.VariableSet,
  },
  WorkspaceResource: {
    ...workspaceResourceResolvers.WorkspaceResource,
  },
  ConfigurationVersion: {
    ...configurationVersionResolvers.ConfigurationVersion,
  },
  Project: {
    ...projectsResolvers.Project,
  },
  AgentPool: {
    ...agentPoolsResolvers.AgentPool,
  },
  RunTrigger: {
    ...runTriggersResolvers.RunTrigger,
  },
  StateVersion: {
    ...stateVersionsResolvers.StateVersion,
  },
  Apply: {
    ...appliesResolvers.Apply,
  },
  ExplorerWorkspaceRow: {
    ...explorerResolvers.ExplorerWorkspaceRow,
  },
  ExplorerTerraformVersionRow: {
    ...explorerResolvers.ExplorerTerraformVersionRow,
  },
  ExplorerProviderRow: {
    ...explorerResolvers.ExplorerProviderRow,
  },
  ExplorerModuleRow: {
    ...explorerResolvers.ExplorerModuleRow,
  },
};

applyTfeOnlyGuards(typeDefs, baseResolvers);

export const resolvers = baseResolvers;

type TfeOnlyFieldMap = Map<string, Set<string>>;

function applyTfeOnlyGuards(
  documents: DocumentNode[],
  targetResolvers: Record<string, any>,
): void {
  const tfeOnlyFields = collectTfeOnlyFields(documents);
  for (const [typeName, fieldNames] of tfeOnlyFields) {
    if (!fieldNames.size) {
      continue;
    }
    const typeResolvers =
      (targetResolvers[typeName] =
        targetResolvers[typeName] ?? Object.create(null));
    for (const fieldName of fieldNames) {
      const existingResolver = typeResolvers[fieldName];
      const wrappedResolver = wrapWithTfeOnlyGuard(
        typeName,
        fieldName,
        existingResolver,
      );
      typeResolvers[fieldName] = wrappedResolver;
    }
  }
}

function collectTfeOnlyFields(documents: DocumentNode[]): TfeOnlyFieldMap {
  const fieldMap: TfeOnlyFieldMap = new Map();

  const recordFields = (
    node: ObjectTypeDefinitionNode | ObjectTypeExtensionNode,
  ) => {
    if (!node.fields || node.fields.length === 0) {
      return;
    }

    const typeHasDirective =
      node.directives?.some((directive) => directive.name.value === "tfeOnly") ??
      false;

    for (const field of node.fields) {
      const fieldHasDirective =
        typeHasDirective ||
        (field.directives?.some(
          (directive) => directive.name.value === "tfeOnly",
        ) ??
          false);

      if (!fieldHasDirective) {
        continue;
      }

      let fieldSet = fieldMap.get(node.name.value);
      if (!fieldSet) {
        fieldSet = new Set<string>();
        fieldMap.set(node.name.value, fieldSet);
      }
      fieldSet.add(field.name.value);
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

function wrapWithTfeOnlyGuard(
  typeName: string,
  fieldName: string,
  resolverCandidate: unknown,
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
      resolve: createTfeOnlyGuard(
        fieldPath,
        candidateObject.resolve as GraphQLFieldResolver<unknown, Context>,
      ),
    };
  }

  const baseResolver: GraphQLFieldResolver<unknown, Context> =
    typeof resolverCandidate === "function"
      ? (resolverCandidate as GraphQLFieldResolver<unknown, Context>)
      : defaultFieldResolver;

  return createTfeOnlyGuard(fieldPath, baseResolver);
}

function createTfeOnlyGuard(
  fieldPath: string,
  resolver: GraphQLFieldResolver<unknown, Context>,
): GraphQLFieldResolver<unknown, Context> {
  return function tfeOnlyGuardedResolver(
    this: unknown,
    source,
    args,
    context,
    info,
  ) {
    if (context.deploymentTarget === "tfc") {
      context.logger.warn(
        { field: fieldPath, deploymentTarget: context.deploymentTarget },
        "TFE-only GraphQL field invoked while targeting Terraform Cloud",
      );

      throw new GraphQLError(
        `${info.parentType.name}.${info.fieldName} is only available when targeting Terraform Enterprise`,
        {
          extensions: {
            code: "TFE_ONLY_ENDPOINT",
            http: { status: 403 },
          },
        },
      );
    }

    return resolver.call(this, source, args, context, info);
  };
}
