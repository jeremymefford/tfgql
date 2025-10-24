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

function evaluateDate(
  value: string | Date,
  filter: FieldComparisonExp,
): boolean {
  const dateValue = value instanceof Date ? value : new Date(value);
  if (
    "_eq" in filter &&
    dateValue.getTime() !== new Date(filter._eq as string).getTime()
  )
    return false;
  if (
    "_neq" in filter &&
    dateValue.getTime() === new Date(filter._neq as string).getTime()
  )
    return false;
  if (
    "_in" in filter &&
    !(filter._in as Date[]).some(
      (d) => new Date(d).getTime() === dateValue.getTime(),
    )
  )
    return false;
  if (
    "_nin" in filter &&
    (filter._nin as Date[]).some(
      (d) => new Date(d).getTime() === dateValue.getTime(),
    )
  )
    return false;
  if (
    "_gt" in filter &&
    typeof filter._gt === "string" &&
    dateValue <= new Date(filter._gt)
  )
    return false;
  if (
    "_gte" in filter &&
    dateValue < new Date(filter._gte as unknown as string)
  )
    return false;
  if ("_lt" in filter && dateValue >= new Date(filter._lt as unknown as string))
    return false;
  if (
    "_lte" in filter &&
    dateValue > new Date(filter._lte as unknown as string)
  )
    return false;
  return true;
}

function evaluateSemver(
  value: string,
  filter: TerraformVersionComparisonExp,
): boolean {
  // TODO: 1.5 is showing as _gte 1.12
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
  const m = value.match(TERRAFORM_VERSION_REGEX);
  if (!m) return false;
  const [major, minor, patch] = m.slice(2, 5).map((n) => parseInt(n, 10)) as [
    number,
    number,
    number,
  ];

  const parse = (v: unknown): [number, number, number] | null => {
    if (typeof v !== "string") return null;
    const mm = v.match(TERRAFORM_VERSION_REGEX);
    return mm
      ? (mm.slice(2, 5).map((n) => parseInt(n, 10)) as [number, number, number])
      : null;
  };

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
