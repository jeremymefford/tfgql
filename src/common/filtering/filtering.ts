import {
  BooleanComparisonExp,
  FieldComparisonExp,
  IntComparisonExp,
  StringComparisonExp,
  TerraformVersionComparisonExp,
  WhereClause,
} from "./types";

const TERRAFORM_VERSION_REGEX =
  /^(~>|>=|<=|>|<|!=|=)?\s*v?(\d+)\.(\d+)(?:\.(\d+))?.*$/;
const ISO_DATE_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})$/;

export function evaluateWhereClause<T, TFilter>(
  where: WhereClause<T, TFilter> | undefined,
  obj: T,
): boolean {
  if (!where) return true;
  if (!obj) return false;

  const logical = {
    _and: (clauses: WhereClause<T, TFilter>[]) =>
      clauses.every((clause) => evaluateWhereClause(clause, obj)),
    _or: (clauses: WhereClause<T, TFilter>[]) =>
      clauses.some((clause) => evaluateWhereClause(clause, obj)),
    _not: (clause: WhereClause<T, TFilter>) =>
      !evaluateWhereClause(clause, obj),
  };

  for (const key in where) {
    if (key === "_and" && Array.isArray(where._and)) {
      if (!logical._and(where._and)) return false;
    } else if (key === "_or" && Array.isArray(where._or)) {
      if (!logical._or(where._or)) return false;
    } else if (key === "_not" && where._not) {
      if (!logical._not(where._not)) return false;
    } else {
      const field = key as keyof T;
      const filter = where[field] as FieldComparisonExp;
      const value = obj[field] as unknown;

      // Handle nested entity filter recursively
      if (
        typeof value === "object" &&
        value !== null &&
        !(value instanceof Date) &&
        !Array.isArray(value) &&
        typeof filter === "object"
      ) {
        if (!evaluateWhereClause(filter as WhereClause<any>, value))
          return false;
        continue;
      }

      if (filter) {
        if (filter._is_null !== undefined) {
          const isNull = value === null || value === undefined;
          if (filter._is_null !== isNull) return false;
        }

        const valueType = typeof value;
        const isDate =
          value instanceof Date ||
          (valueType === "string" &&
            ISO_DATE_REGEX.test(value as string) &&
            !isNaN(Date.parse(value as string)));
        const isSemver =
          valueType === "string" &&
          TERRAFORM_VERSION_REGEX.test(value as string);

        switch (valueType) {
          case "string":
            if (isDate) {
              if (!evaluateDate(value as string, filter)) return false;
            } else if (isSemver) {
              if (
                !evaluateSemver(
                  value as string,
                  filter as TerraformVersionComparisonExp,
                )
              )
                return false;
            } else {
              if (
                !evaluateString(value as string, filter as StringComparisonExp)
              )
                return false;
            }
            break;
          case "number":
            if (!evaluateNumber(value as number, filter as IntComparisonExp))
              return false;
            break;
          case "boolean":
            if (
              !evaluateBoolean(value as boolean, filter as BooleanComparisonExp)
            )
              return false;
            break;
          case "object":
            if (isDate) {
              if (!evaluateDate(value as string | Date, filter)) return false;
            }
            break;
          default:
            break;
        }
      }
    }
  }

  return true;
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function like(value: string, pattern: string): boolean {
  // Convert SQL LIKE pattern to safe regex:
  // - Escape regex metacharacters first
  // - Then translate % -> .*, _ -> .
  const escaped = escapeRegex(pattern);
  const source = "^" + escaped.replace(/%/g, ".*").replace(/_/g, ".") + "$";
  const regex = new RegExp(source);
  return regex.test(value);
}

function evaluateString(value: string, filter: StringComparisonExp): boolean {
  if ("_eq" in filter && value !== filter._eq) return false;
  if ("_neq" in filter && value === filter._neq) return false;
  if ("_in" in filter && !(filter._in as unknown[])?.includes(value))
    return false;
  if ("_nin" in filter && (filter._nin as unknown[])?.includes(value))
    return false;
  if (
    "_like" in filter &&
    typeof filter._like === "string" &&
    !like(value, filter._like)
  )
    return false;
  if (
    "_nlike" in filter &&
    typeof filter._nlike === "string" &&
    like(value, filter._nlike)
  )
    return false;
  if (
    "_ilike" in filter &&
    typeof filter._ilike === "string" &&
    !like(value.toLowerCase(), filter._ilike.toLowerCase())
  )
    return false;
  if (
    "_nilike" in filter &&
    typeof filter._nilike === "string" &&
    like(value.toLowerCase(), filter._nilike.toLowerCase())
  )
    return false;
  return true;
}

function evaluateNumber(value: number, filter: IntComparisonExp): boolean {
  if ("_eq" in filter && value !== filter._eq) return false;
  if ("_neq" in filter && value === filter._neq) return false;
  if ("_in" in filter && !(filter._in as number[])?.includes(value))
    return false;
  if ("_nin" in filter && (filter._nin as number[])?.includes(value))
    return false;
  if (
    "_gt" in filter &&
    (value === null || value === undefined || value <= Number(filter._gt))
  )
    return false;
  if (
    "_gte" in filter &&
    (value === null || value === undefined || value < Number(filter._gte))
  )
    return false;
  if (
    "_lt" in filter &&
    (value === null || value === undefined || value >= Number(filter._lt))
  )
    return false;
  if (
    "_lte" in filter &&
    (value === null || value === undefined || value > Number(filter._lte))
  )
    return false;
  return true;
}

function evaluateBoolean(
  value: boolean,
  filter: BooleanComparisonExp,
): boolean {
  if ("_eq" in filter && value !== filter._eq) return false;
  if ("_neq" in filter && value === filter._neq) return false;
  return true;
}

function coerceDate(input: unknown): Date | null {
  if (input instanceof Date) return input;
  if (typeof input === "string" || typeof input === "number") {
    const parsed = new Date(input);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
}

function evaluateDate(
  value: string | Date,
  filter: FieldComparisonExp,
): boolean {
  const dateValue = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateValue.getTime())) return false;
  const dateMillis = dateValue.getTime();
  const toMillis = (input: unknown): number | null =>
    coerceDate(input)?.getTime() ?? null;

  if ("_eq" in filter) {
    const comparison = toMillis(filter._eq);
    if (comparison !== null && dateMillis !== comparison) return false;
  }
  if ("_neq" in filter) {
    const comparison = toMillis(filter._neq);
    if (comparison !== null && dateMillis === comparison) return false;
  }
  if ("_in" in filter) {
    const comparisons = ((filter._in as unknown[]) ?? [])
      .map(toMillis)
      .filter((millis): millis is number => millis !== null);
    if (comparisons.length > 0 && !comparisons.includes(dateMillis))
      return false;
  }
  if ("_nin" in filter) {
    const comparisons = ((filter._nin as unknown[]) ?? [])
      .map(toMillis)
      .filter((millis): millis is number => millis !== null);
    if (comparisons.length > 0 && comparisons.includes(dateMillis))
      return false;
  }
  if ("_gt" in filter) {
    const comparison = coerceDate(filter._gt);
    if (comparison && dateMillis <= comparison.getTime()) return false;
  }
  if ("_gte" in filter) {
    const comparison = coerceDate(filter._gte);
    if (comparison && dateMillis < comparison.getTime()) return false;
  }
  if ("_lt" in filter) {
    const comparison = coerceDate(filter._lt);
    if (comparison && dateMillis >= comparison.getTime()) return false;
  }
  if ("_lte" in filter) {
    const comparison = coerceDate(filter._lte);
    if (comparison && dateMillis > comparison.getTime()) return false;
  }
  return true;
}

function evaluateSemver(
  value: string,
  filter: TerraformVersionComparisonExp,
): boolean {
  // string-based equality/membership
  if ("_eq" in filter && value !== filter._eq) return false;
  if ("_neq" in filter && value === filter._neq) return false;
  if (
    "_in" in filter &&
    Array.isArray(filter._in) &&
    !filter._in.includes(value)
  )
    return false;
  if (
    "_nin" in filter &&
    Array.isArray(filter._nin) &&
    filter._nin.includes(value)
  )
    return false;

  // numeric comparison based on vMAJOR.MINOR.PATCH
  const parsedValue = parseSemverTuple(value);
  if (!parsedValue) return false;
  const [major, minor, patch] = parsedValue;

  const parse = (v: unknown): [number, number, number] | null =>
    typeof v === "string" ? parseSemverTuple(v) : null;

  const compare = (
    a: [number, number, number],
    b: [number, number, number],
  ) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    if (a[1] !== b[1]) return a[1] - b[1];
    return a[2] - b[2];
  };

  if ("_gt" in filter) {
    const parsed = parse(filter._gt);
    if (parsed && compare([major, minor, patch], parsed) <= 0) return false;
  }
  if ("_gte" in filter) {
    const parsed = parse(filter._gte);
    if (parsed && compare([major, minor, patch], parsed) < 0) return false;
  }
  if ("_lt" in filter) {
    const parsed = parse(filter._lt);
    if (parsed && compare([major, minor, patch], parsed) >= 0) return false;
  }
  if ("_lte" in filter) {
    const parsed = parse(filter._lte);
    if (parsed && compare([major, minor, patch], parsed) > 0) return false;
  }

  return true;
}

function parseSemverTuple(input: string): [number, number, number] | null {
  const match = input.match(TERRAFORM_VERSION_REGEX);
  if (!match) return null;
  const major = parseInt(match[2], 10);
  const minor = parseInt(match[3], 10);
  if (typeof match[4] === "undefined") return null;
  const patch = parseInt(match[4], 10);
  if ([major, minor, patch].some((part) => Number.isNaN(part))) return null;
  return [major, minor, patch];
}
