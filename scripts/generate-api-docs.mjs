/**
 * Generates API Reference documentation from GraphQL schema files.
 *
 * Usage: node scripts/generate-api-docs.mjs
 *
 * Reads all src/* /schema.ts files, extracts SDL from gql`...` template
 * literals, builds the full schema, and writes Markdown reference pages
 * into docs/docs/API Reference/.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSchema } from "graphql";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "src");
const DOCS_OUT = join(ROOT, "docs", "docs", "API Reference");

// ---------------------------------------------------------------------------
// 1. Discover schema files
// ---------------------------------------------------------------------------

function findSchemaFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findSchemaFiles(full));
    else if (entry.name === "schema.ts") results.push(full);
  }
  return results;
}

// ---------------------------------------------------------------------------
// 2. Extract SDL from gql`...` template literals
// ---------------------------------------------------------------------------

function extractSDL(filePath) {
  const src = readFileSync(filePath, "utf-8");
  const parts = [];
  const re = /gql`([\s\S]*?)`/g;
  let m;
  while ((m = re.exec(src)) !== null) parts.push(m[1]);
  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// 3. Build a single SDL string from all schema files + base types
// ---------------------------------------------------------------------------

function buildCombinedSDL(schemaFiles) {
  const base = `
directive @tfeOnly on FIELD_DEFINITION | OBJECT
directive @tfcOnly on FIELD_DEFINITION | OBJECT

scalar DateTime
scalar JSON

type Query {
  _empty: String
}

type Mutation {
  _empty: String
}
`;

  let combined = base;
  const seenScalars = new Set(["DateTime", "JSON"]);

  for (const file of schemaFiles) {
    let sdl = extractSDL(file);
    // Strip duplicate scalar declarations already in the base
    sdl = sdl.replace(/^\s*scalar\s+(DateTime|JSON)\s*$/gm, (match, name) => {
      if (seenScalars.has(name)) return "";
      seenScalars.add(name);
      return match;
    });
    combined += "\n" + sdl;
  }
  return combined;
}

// ---------------------------------------------------------------------------
// 4. Introspect the built schema and generate Markdown
// ---------------------------------------------------------------------------

/** Return true for built-in / internal types we should skip. */
function isBuiltIn(name) {
  return name.startsWith("__") || ["String", "Int", "Float", "Boolean", "ID"].includes(name);
}

function typeRef(t) {
  if (t.ofType) {
    if (t.constructor.name === "GraphQLNonNull") return `${typeRef(t.ofType)}!`;
    if (t.constructor.name === "GraphQLList") return `[${typeRef(t.ofType)}]`;
  }
  return t.name || String(t);
}

function fieldRow(field) {
  const args =
    field.args && field.args.length
      ? field.args.map((a) => `${a.name}: ${typeRef(a.type)}`).join(", ")
      : "";
  const argsStr = args ? `(${args})` : "";
  const desc = field.description ? field.description.replace(/\n/g, " ") : "";
  return `| \`${field.name}${argsStr}\` | \`${typeRef(field.type)}\` | ${desc} |`;
}

function generateQueriesPage(schema) {
  const queryType = schema.getQueryType();
  if (!queryType) return "";
  const fields = Object.values(queryType.getFields()).filter((f) => f.name !== "_empty");

  // Group by primary entity name (heuristic: first word of field name)
  let lines = [
    "---",
    "title: Queries",
    "description: All available root query fields",
    "---",
    "",
    "# Queries",
    "",
    "All root-level query fields available in the TFGQL schema.",
    "",
    "| Query | Return Type | Description |",
    "| ----- | ----------- | ----------- |",
  ];

  for (const f of fields) {
    lines.push(fieldRow(f));
  }

  return lines.join("\n") + "\n";
}

function generateTypesPage(schema) {
  const typeMap = schema.getTypeMap();
  const objectTypes = Object.values(typeMap).filter(
    (t) =>
      !isBuiltIn(t.name) &&
      t.constructor.name === "GraphQLObjectType" &&
      t.name !== "Query" &&
      t.name !== "Mutation",
  );
  objectTypes.sort((a, b) => a.name.localeCompare(b.name));

  const interfaceTypes = Object.values(typeMap).filter(
    (t) => !isBuiltIn(t.name) && t.constructor.name === "GraphQLInterfaceType",
  );
  interfaceTypes.sort((a, b) => a.name.localeCompare(b.name));

  const enumTypes = Object.values(typeMap).filter(
    (t) => !isBuiltIn(t.name) && t.constructor.name === "GraphQLEnumType",
  );
  enumTypes.sort((a, b) => a.name.localeCompare(b.name));

  let lines = [
    "---",
    "title: Types",
    "description: All GraphQL object types, interfaces, and enums",
    "---",
    "",
    "# Types",
    "",
    "All object types, interfaces, and enums in the TFGQL schema.",
    "",
  ];

  // Table of contents
  lines.push("## Object Types", "");
  for (const t of objectTypes) {
    lines.push(`- [${t.name}](#${t.name.toLowerCase()})`);
  }

  if (interfaceTypes.length) {
    lines.push("", "## Interfaces", "");
    for (const t of interfaceTypes) {
      lines.push(`- [${t.name}](#${t.name.toLowerCase()})`);
    }
  }

  if (enumTypes.length) {
    lines.push("", "## Enums", "");
    for (const t of enumTypes) {
      lines.push(`- [${t.name}](#${t.name.toLowerCase()})`);
    }
  }

  lines.push("", "---", "");

  // Object type details
  for (const t of objectTypes) {
    const desc = t.description ? `\n${t.description}\n` : "";
    lines.push(`### ${t.name}`, desc, "| Field | Type | Description |", "| ----- | ---- | ----------- |");
    for (const f of Object.values(t.getFields())) {
      lines.push(fieldRow(f));
    }
    lines.push("", "---", "");
  }

  // Interface details
  for (const t of interfaceTypes) {
    const desc = t.description ? `\n${t.description}\n` : "";
    lines.push(`### ${t.name}`, desc, "| Field | Type | Description |", "| ----- | ---- | ----------- |");
    for (const f of Object.values(t.getFields())) {
      lines.push(fieldRow(f));
    }
    lines.push("", "---", "");
  }

  // Enum details
  for (const t of enumTypes) {
    const desc = t.description ? `\n${t.description}\n` : "";
    lines.push(`### ${t.name}`, desc, "| Value |", "| ----- |");
    for (const v of t.getValues()) {
      lines.push(`| \`${v.name}\` |`);
    }
    lines.push("", "---", "");
  }

  return lines.join("\n") + "\n";
}

function generateInputsPage(schema) {
  const typeMap = schema.getTypeMap();
  const inputTypes = Object.values(typeMap).filter(
    (t) => !isBuiltIn(t.name) && t.constructor.name === "GraphQLInputObjectType",
  );
  inputTypes.sort((a, b) => a.name.localeCompare(b.name));

  // Separate filter types from other inputs
  const filters = inputTypes.filter((t) => t.name.endsWith("Filter") || t.name.endsWith("ComparisonExp"));
  const otherInputs = inputTypes.filter((t) => !t.name.endsWith("Filter") && !t.name.endsWith("ComparisonExp"));

  let lines = [
    "---",
    "title: Inputs & Filters",
    "description: All input types and filter expressions",
    "---",
    "",
    "# Inputs & Filters",
    "",
    "All input types used for filtering and query parameters.",
    "",
  ];

  // Comparison expressions first
  const comparisons = filters.filter((t) => t.name.endsWith("ComparisonExp"));
  const entityFilters = filters.filter((t) => !t.name.endsWith("ComparisonExp"));

  if (comparisons.length) {
    lines.push("## Comparison Operators", "");
    lines.push(
      "These are the base comparison types used by all entity filters. See the [Filtering](../Concepts/filtering) page for usage examples.",
      "",
    );
    for (const t of comparisons) {
      lines.push(`### ${t.name}`, "", "| Operator | Type |", "| -------- | ---- |");
      for (const f of Object.values(t.getFields())) {
        lines.push(`| \`${f.name}\` | \`${typeRef(f.type)}\` |`);
      }
      lines.push("", "---", "");
    }
  }

  if (entityFilters.length) {
    lines.push("## Entity Filters", "");
    lines.push(
      "Each entity has a corresponding filter input type. Filters support `_and`, `_or`, and `_not` for boolean composition.",
      "",
    );
    for (const t of entityFilters) {
      lines.push(`### ${t.name}`, "", "| Field | Type |", "| ----- | ---- |");
      for (const f of Object.values(t.getFields())) {
        if (["_and", "_or", "_not"].includes(f.name)) continue; // Skip logical operators (documented above)
        lines.push(`| \`${f.name}\` | \`${typeRef(f.type)}\` |`);
      }
      lines.push("", "---", "");
    }
  }

  if (otherInputs.length) {
    lines.push("## Other Input Types", "");
    for (const t of otherInputs) {
      lines.push(`### ${t.name}`, "", "| Field | Type |", "| ----- | ---- |");
      for (const f of Object.values(t.getFields())) {
        lines.push(`| \`${f.name}\` | \`${typeRef(f.type)}\` |`);
      }
      lines.push("", "---", "");
    }
  }

  return lines.join("\n") + "\n";
}

function generateIndexPage(schema) {
  const queryType = schema.getQueryType();
  const queryCount = queryType ? Object.keys(queryType.getFields()).length - 1 : 0; // -1 for _empty
  const typeMap = schema.getTypeMap();
  const objectCount = Object.values(typeMap).filter(
    (t) =>
      !isBuiltIn(t.name) &&
      t.constructor.name === "GraphQLObjectType" &&
      t.name !== "Query" &&
      t.name !== "Mutation",
  ).length;
  const inputCount = Object.values(typeMap).filter(
    (t) => !isBuiltIn(t.name) && t.constructor.name === "GraphQLInputObjectType",
  ).length;

  return [
    "---",
    "title: API Reference",
    "description: Auto-generated GraphQL schema reference for TFGQL",
    "---",
    "",
    "# API Reference",
    "",
    "Auto-generated reference documentation for the TFGQL GraphQL schema.",
    "",
    `| | Count |`,
    `| --- | --- |`,
    `| Root queries | ${queryCount} |`,
    `| Object types | ${objectCount} |`,
    `| Input / filter types | ${inputCount} |`,
    "",
    "## Sections",
    "",
    "- [Queries](queries) — All root-level query fields",
    "- [Types](types) — Object types, interfaces, and enums",
    "- [Inputs & Filters](inputs-and-filters) — Filter expressions and input types",
    "",
    ":::tip",
    "This reference is auto-generated from the GraphQL schema source files. Run `npm run generate:api-docs` to regenerate after schema changes.",
    ":::",
    "",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const schemaFiles = findSchemaFiles(SRC);
console.log(`Found ${schemaFiles.length} schema files`);

const sdl = buildCombinedSDL(schemaFiles);
const schema = buildSchema(sdl);
console.log("Schema built successfully");

mkdirSync(DOCS_OUT, { recursive: true });

writeFileSync(join(DOCS_OUT, "index.md"), generateIndexPage(schema));
writeFileSync(join(DOCS_OUT, "queries.md"), generateQueriesPage(schema));
writeFileSync(join(DOCS_OUT, "types.md"), generateTypesPage(schema));
writeFileSync(join(DOCS_OUT, "inputs-and-filters.md"), generateInputsPage(schema));

console.log(`Generated API docs in ${DOCS_OUT}`);
