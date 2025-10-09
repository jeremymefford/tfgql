import { GraphQLScalarType, Kind } from "graphql";

/**
 * Custom GraphQL scalar type for ISO 8601 date-time strings.
 */
export const DateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "An ISO-8601 encoded UTC date/time string.",
  serialize(value: unknown): string {
    // Output: convert Date or timestamp to ISO string
    if (value instanceof Date) {
      return value.toISOString();
    } else if (typeof value === "string" || typeof value === "number") {
      return new Date(value).toISOString();
    }
    throw new Error("DateTime cannot serialize non-date value");
  },
  parseValue(value: unknown): Date {
    // Input from variables: accept string or number and convert to Date
    if (typeof value === "string" || typeof value === "number") {
      return new Date(value);
    }
    throw new Error("DateTime must be a ISO date string or timestamp");
  },
  parseLiteral(ast) {
    // Input from inline query literals
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  },
});
