export interface StringComparisonExp {
  _eq?: string;
  _neq?: string;
  _in?: string[];
  _nin?: string[];
  _like?: string;
  _nlike?: string;
  _ilike?: string;
  _nilike?: string;
  _is_null?: boolean;
}

export interface TerraformVersionComparisonExp {
  _eq?: string;
  _neq?: string;
  _in?: string[];
  _nin?: string[];
  _like?: string;
  _nlike?: string;
  _ilike?: string;
  _nilike?: string;
  _is_null?: boolean;
  _gt?: string;
  _gte?: string;
  _lt?: string;
  _lte?: string;
}

export interface IntComparisonExp {
  _eq?: number;
  _neq?: number;
  _in?: number[];
  _nin?: number[];
  _is_null?: boolean;
  _gt?: number;
  _gte?: number;
  _lt?: number;
  _lte?: number;
}

export interface BooleanComparisonExp {
  _eq?: boolean;
  _neq?: boolean;
  _is_null?: boolean;
}

export interface DateTimeComparisonExp {
  _eq?: Date;
  _neq?: Date;
  _in?: Date[];
  _nin?: Date[];
  _is_null?: boolean;
  _gt?: Date;
  _gte?: Date;
  _lt?: Date;
  _lte?: Date;
}

export type FieldComparisonExp =
  | StringComparisonExp
  | IntComparisonExp
  | BooleanComparisonExp
  | DateTimeComparisonExp
  | TerraformVersionComparisonExp;

export type WhereClause<T, TFilters = {}> = {
  _and?: WhereClause<T, TFilters>[];
  _or?: WhereClause<T, TFilters>[];
  _not?: WhereClause<T, TFilters>;
} & {
  [K in keyof T]?: K extends keyof TFilters ? TFilters[K] : FieldComparisonExp;
};
