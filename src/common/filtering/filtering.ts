import {
    FieldComparisonExp,
    WhereClause,
} from './types';

export function evaluateWhereClause<T, TFilter>(where: WhereClause<T, TFilter> | undefined, obj: T): boolean {
    if (!where) return true;

    const logical = {
        _and: (clauses: WhereClause<T, TFilter>[]) => clauses.every(clause => evaluateWhereClause(clause, obj)),
        _or: (clauses: WhereClause<T, TFilter>[]) => clauses.some(clause => evaluateWhereClause(clause, obj)),
        _not: (clause: WhereClause<T, TFilter>) => !evaluateWhereClause(clause, obj),
    };

    for (const key in where) {
        if (key === '_and' && Array.isArray(where._and)) {
            if (!logical._and(where._and)) return false;
        } else if (key === '_or' && Array.isArray(where._or)) {
            if (!logical._or(where._or)) return false;
        } else if (key === '_not' && where._not) {
            if (!logical._not(where._not)) return false;
        } else {
            const field = key as keyof T;
            const filter = where[field] as FieldComparisonExp;
            const value = obj[field] as unknown;

            // Handle nested entity filter recursively
            if (
                typeof value === 'object' &&
                value !== null &&
                !(value instanceof Date) &&
                !Array.isArray(value) &&
                typeof filter === 'object'
            ) {
                if (!evaluateWhereClause(filter as WhereClause<any>, value)) return false;
                continue;
            }

            if (key == "createdAt") {
                console.log(JSON.stringify(obj, null, 2));
            }

            if (filter) {
                if (filter._is_null !== undefined) {
                    const isNull = value === null || value === undefined;
                    if (filter._is_null !== isNull) return false;
                }

                const valueType = typeof value;
                const isDate = value instanceof Date || (valueType === 'string' && !isNaN(Date.parse(value as string)));

                switch (valueType) {
                    case 'string':
                        if (isDate) {
                            if (!evaluateDate(value as string, filter)) return false;
                        } else {
                            if (!evaluateString(value as string, filter)) return false;
                        }
                        break;
                    case 'number':
                        if (!evaluateNumber(value as number, filter)) return false;
                        break;
                    case 'boolean':
                        if (!evaluateBoolean(value as boolean, filter)) return false;
                        break;
                    case 'object':
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

function like(value: string, pattern: string): boolean {
    const regex = new RegExp('^' + pattern.replace(/%/g, '.*').replace(/_/g, '.') + '$');
    return regex.test(value);
}

function evaluateString(value: string, filter: FieldComparisonExp): boolean {
    if ('_eq' in filter && value !== filter._eq) return false;
    if ('_neq' in filter && value === filter._neq) return false;
    if ('_in' in filter && !(filter._in as unknown[])?.includes(value)) return false;
    if ('_nin' in filter && (filter._nin as unknown[])?.includes(value)) return false;
    if ('_like' in filter && typeof filter._like === 'string' && !like(value, filter._like)) return false;
    if ('_nlike' in filter && typeof filter._nlike === 'string' && like(value, filter._nlike)) return false;
    if ('_ilike' in filter && typeof filter._ilike === 'string' && !like(value.toLowerCase(), filter._ilike.toLowerCase())) return false;
    if ('_nilike' in filter && typeof filter._nilike === 'string' && like(value.toLowerCase(), filter._nilike.toLowerCase())) return false;
    return true;
}

function evaluateNumber(value: number, filter: FieldComparisonExp): boolean {
    if ('_eq' in filter && value !== filter._eq) return false;
    if ('_neq' in filter && value === filter._neq) return false;
    if ('_in' in filter && !(filter._in as number[])?.includes(value)) return false;
    if ('_nin' in filter && (filter._nin as number[])?.includes(value)) return false;
    if ('_gt' in filter && (value === null || value === undefined || value <= Number(filter._gt))) return false;
    if ('_gte' in filter && (value === null || value === undefined || value < Number(filter._gte))) return false;
    if ('_lt' in filter && (value === null || value === undefined || value >= Number(filter._lt))) return false;
    if ('_lte' in filter && (value === null || value === undefined || value > Number(filter._lte))) return false;
    return true;
}

function evaluateBoolean(value: boolean, filter: FieldComparisonExp): boolean {
    if ('_eq' in filter && value !== filter._eq) return false;
    if ('_neq' in filter && value === filter._neq) return false;
    return true;
}

function evaluateDate(value: string | Date, filter: FieldComparisonExp): boolean {
    const dateValue = value instanceof Date ? value : new Date(value);
    if ('_eq' in filter && dateValue.getTime() !== new Date(filter._eq as string).getTime()) return false;
    if ('_neq' in filter && dateValue.getTime() === new Date(filter._neq as string).getTime()) return false;
    if ('_in' in filter && !(filter._in as Date[]).some(d => new Date(d).getTime() === dateValue.getTime())) return false;
    if ('_nin' in filter && (filter._nin as Date[]).some(d => new Date(d).getTime() === dateValue.getTime())) return false;
    if ('_gt' in filter && typeof filter._gt === 'string' && dateValue <= new Date(filter._gt)) return false;
    if ('_gte' in filter && dateValue < new Date((filter._gte as unknown) as string)) return false;
    if ('_lt' in filter && dateValue >= new Date((filter._lt as unknown) as string)) return false;
    if ('_lte' in filter && dateValue > new Date((filter._lte as unknown) as string)) return false;
    return true;
}