import { describe, expect, it } from "vitest";

import { evaluateWhereClause } from "../../../src/common/filtering/filtering";

interface FilteringTestCase {
  name: string;
  where: unknown;
  expected: boolean;
  object?: unknown;
}

function runCases(base: unknown, cases: FilteringTestCase[]): void {
  cases.forEach((testCase, index) => {
    it(`${index + 1}. ${testCase.name}`, () => {
      const hasCustomObject = Object.prototype.hasOwnProperty.call(
        testCase,
        "object",
      );
      const evaluatedObject = hasCustomObject
        ? testCase.object
        : base;
      expect(
        evaluateWhereClause<any, Record<string, unknown>>(
          testCase.where as any,
          evaluatedObject,
        ),
      ).toBe(testCase.expected);
    });
  });
}

describe("evaluateWhereClause - string comparisons", () => {
  type StringBase = {
    name: string;
    alt: string;
    empty: string;
    nullable: string | null;
    optional?: string;
  };

  const base: StringBase = {
    name: "alpha",
    alt: "AlphaBeta",
    empty: "",
    nullable: null,
  };

  const cases: FilteringTestCase[] = [
    {
      name: "_eq matches exact string",
      where: { name: { _eq: "alpha" } },
      expected: true,
    },
    {
      name: "_eq fails when value differs",
      where: { name: { _eq: "bravo" } },
      expected: false,
    },
    {
      name: "_neq succeeds when value differs",
      where: { name: { _neq: "bravo" } },
      expected: true,
    },
    {
      name: "_neq fails when value matches",
      where: { name: { _neq: "alpha" } },
      expected: false,
    },
    {
      name: "_in succeeds when list contains value",
      where: { name: { _in: ["alpha", "bravo"] } },
      expected: true,
    },
    {
      name: "_in fails when list omits value",
      where: { name: { _in: ["bravo", "charlie"] } },
      expected: false,
    },
    {
      name: "_nin succeeds when list omits value",
      where: { name: { _nin: ["bravo", "charlie"] } },
      expected: true,
    },
    {
      name: "_nin fails when list contains value",
      where: { name: { _nin: ["alpha", "bravo"] } },
      expected: false,
    },
    {
      name: "_like matches wildcard prefix",
      where: { name: { _like: "a%" } },
      expected: true,
    },
    {
      name: "_like fails when pattern does not match",
      where: { name: { _like: "b%" } },
      expected: false,
    },
    {
      name: "_nlike succeeds when pattern does not match",
      where: { name: { _nlike: "b%" } },
      expected: true,
    },
    {
      name: "_nlike fails when pattern matches",
      where: { name: { _nlike: "a%" } },
      expected: false,
    },
    {
      name: "_ilike matches case-insensitively",
      where: { alt: { _ilike: "AL%" } },
      expected: true,
    },
    {
      name: "_ilike fails when pattern mismatches",
      where: { alt: { _ilike: "BR%" } },
      expected: false,
    },
    {
      name: "_nilike succeeds when pattern mismatches case-insensitively",
      where: { alt: { _nilike: "BR%" } },
      expected: true,
    },
    {
      name: "_nilike fails when pattern matches case-insensitively",
      where: { alt: { _nilike: "AL%" } },
      expected: false,
    },
    {
      name: "_is_null succeeds for optional property",
      where: { optional: { _is_null: true } },
      expected: true,
    },
    {
      name: "_is_null succeeds for defined property when false",
      where: { name: { _is_null: false } },
      expected: true,
    },
    {
      name: "_eq matches empty string values",
      where: { empty: { _eq: "" } },
      expected: true,
    },
    {
      name: "_neq fails when empty string matches",
      where: { empty: { _neq: "" } },
      expected: false,
    },
  ];

  runCases(base, cases);
});

describe("evaluateWhereClause - numeric comparisons", () => {
  type NumberBase = {
    count: number;
    price: number;
    zero: number;
  };

  const base: NumberBase = {
    count: 42,
    price: 99.5,
    zero: 0,
  };

  const cases: FilteringTestCase[] = [
    {
      name: "_eq matches integer values",
      where: { count: { _eq: 42 } },
      expected: true,
    },
    {
      name: "_eq fails when integer differs",
      where: { count: { _eq: 41 } },
      expected: false,
    },
    {
      name: "_neq succeeds when integer differs",
      where: { count: { _neq: 41 } },
      expected: true,
    },
    {
      name: "_neq fails when integer matches",
      where: { count: { _neq: 42 } },
      expected: false,
    },
    {
      name: "_in succeeds when list includes integer",
      where: { count: { _in: [12, 42, 99] } },
      expected: true,
    },
    {
      name: "_in fails when list excludes integer",
      where: { count: { _in: [1, 2] } },
      expected: false,
    },
    {
      name: "_nin succeeds when list excludes integer",
      where: { count: { _nin: [1, 2] } },
      expected: true,
    },
    {
      name: "_nin fails when list includes integer",
      where: { count: { _nin: [42, 99] } },
      expected: false,
    },
    {
      name: "_gt succeeds when value is greater",
      where: { count: { _gt: 40 } },
      expected: true,
    },
    {
      name: "_gt fails when value is not greater",
      where: { count: { _gt: 100 } },
      expected: false,
    },
    {
      name: "_gte succeeds when value equals threshold",
      where: { count: { _gte: 42 } },
      expected: true,
    },
    {
      name: "_gte fails when value is below threshold",
      where: { count: { _gte: 100 } },
      expected: false,
    },
    {
      name: "_lt succeeds when value is below threshold",
      where: { count: { _lt: 50 } },
      expected: true,
    },
    {
      name: "_lt fails when value equals threshold",
      where: { count: { _lt: 42 } },
      expected: false,
    },
    {
      name: "_lte succeeds when value equals threshold",
      where: { count: { _lte: 42 } },
      expected: true,
    },
    {
      name: "_lte fails when value exceeds threshold",
      where: { count: { _lte: 40 } },
      expected: false,
    },
    {
      name: "_is_null succeeds for missing numeric property",
      where: { missing: { _is_null: true } },
      expected: true,
    },
    {
      name: "_is_null succeeds for defined property when false",
      where: { price: { _is_null: false } },
      expected: true,
    },
    {
      name: "_gt succeeds for floating point comparison",
      where: { price: { _gt: 80 } },
      expected: true,
    },
    {
      name: "_lt fails when floating point comparison does not hold",
      where: { price: { _lt: 80 } },
      expected: false,
    },
  ];

  runCases(base, cases);
});

describe("evaluateWhereClause - boolean comparisons", () => {
  type BooleanBase = {
    active: boolean;
    archived: boolean;
    optional?: boolean;
  };

  const base: BooleanBase = {
    active: true,
    archived: false,
  };

  const cases: FilteringTestCase[] = [
    {
      name: "_eq matches true values",
      where: { active: { _eq: true } },
      expected: true,
    },
    {
      name: "_eq fails when expecting false",
      where: { active: { _eq: false } },
      expected: false,
    },
    {
      name: "_neq succeeds when comparing to false",
      where: { active: { _neq: false } },
      expected: true,
    },
    {
      name: "_neq fails when comparing to true",
      where: { active: { _neq: true } },
      expected: false,
    },
    {
      name: "_eq matches false values",
      where: { archived: { _eq: false } },
      expected: true,
    },
    {
      name: "_neq succeeds when comparing false to true",
      where: { archived: { _neq: true } },
      expected: true,
    },
    {
      name: "_neq fails when comparing false to false",
      where: { archived: { _neq: false } },
      expected: false,
    },
    {
      name: "_is_null succeeds for optional property",
      where: { optional: { _is_null: true } },
      expected: true,
    },
    {
      name: "_is_null succeeds for defined property when false",
      where: { active: { _is_null: false } },
      expected: true,
    },
    {
      name: "_eq fails when expecting true for false value",
      where: { archived: { _eq: true } },
      expected: false,
    },
  ];

  runCases(base, cases);
});

describe("evaluateWhereClause - date comparisons", () => {
  type DateBase = {
    createdAt: Date;
    updatedAt: Date;
    optionalDate: Date | null;
  };

  const base: DateBase = {
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-05T12:30:00.000Z"),
    optionalDate: null,
  };

  const cases: FilteringTestCase[] = [
    {
      name: "_eq matches identical Date instances",
      where: { createdAt: { _eq: new Date("2024-01-01T00:00:00.000Z") } },
      expected: true,
    },
    {
      name: "_eq matches ISO string dates",
      where: { createdAt: { _eq: "2024-01-01T00:00:00.000Z" } },
      expected: true,
    },
    {
      name: "_eq fails when dates differ",
      where: { createdAt: { _eq: new Date("2024-01-02T00:00:00.000Z") } },
      expected: false,
    },
    {
      name: "_neq succeeds when dates differ",
      where: { createdAt: { _neq: new Date("2024-01-02T00:00:00.000Z") } },
      expected: true,
    },
    {
      name: "_neq fails when dates match",
      where: { createdAt: { _neq: new Date("2024-01-01T00:00:00.000Z") } },
      expected: false,
    },
    {
      name: "_gt succeeds with later string threshold",
      where: { updatedAt: { _gt: "2024-01-04T00:00:00.000Z" } },
      expected: true,
    },
    {
      name: "_gt fails when threshold equals value",
      where: { updatedAt: { _gt: "2024-01-05T12:30:00.000Z" } },
      expected: false,
    },
    {
      name: "_gte succeeds when threshold equals value",
      where: { updatedAt: { _gte: "2024-01-05T12:30:00.000Z" } },
      expected: true,
    },
    {
      name: "_gte fails when threshold exceeds value",
      where: { updatedAt: { _gte: "2024-01-06T00:00:00.000Z" } },
      expected: false,
    },
    {
      name: "_lt succeeds with later threshold",
      where: { createdAt: { _lt: "2024-01-02T00:00:00.000Z" } },
      expected: true,
    },
    {
      name: "_lt fails when threshold equals value",
      where: { createdAt: { _lt: "2024-01-01T00:00:00.000Z" } },
      expected: false,
    },
    {
      name: "_lte succeeds when threshold equals value",
      where: { createdAt: { _lte: "2024-01-01T00:00:00.000Z" } },
      expected: true,
    },
    {
      name: "_lte fails when threshold precedes value",
      where: { createdAt: { _lte: "2023-12-31T23:59:59.000Z" } },
      expected: false,
    },
    {
      name: "_in succeeds when collection contains date",
      where: {
        createdAt: {
          _in: [
            new Date("2024-01-01T00:00:00.000Z"),
            new Date("2024-02-01T00:00:00.000Z"),
          ],
        },
      },
      expected: true,
    },
    {
      name: "_nin fails when collection contains date",
      where: {
        createdAt: {
          _nin: [
            new Date("2024-01-01T00:00:00.000Z"),
            new Date("2024-02-01T00:00:00.000Z"),
          ],
        },
      },
      expected: false,
    },
    {
      name: "_is_null succeeds for nullable date",
      where: { optionalDate: { _is_null: true } },
      expected: true,
    },
  ];

  runCases(base, cases);
});

describe("evaluateWhereClause - semantic version comparisons", () => {
  const base = {
    terraformVersion: "1.5.0",
    pluginVersion: "2.3.4",
  };

  const cases: FilteringTestCase[] = [
    {
      name: "_eq matches identical versions",
      where: { terraformVersion: { _eq: "1.5.0" } },
      expected: true,
    },
    {
      name: "_eq fails when versions differ",
      where: { terraformVersion: { _eq: "1.5.1" } },
      expected: false,
    },
    {
      name: "_neq succeeds when versions differ",
      where: { terraformVersion: { _neq: "1.5.1" } },
      expected: true,
    },
    {
      name: "_neq fails when versions match",
      where: { terraformVersion: { _neq: "1.5.0" } },
      expected: false,
    },
    {
      name: "_in succeeds when list contains version",
      where: { terraformVersion: { _in: ["1.4.0", "1.5.0"] } },
      expected: true,
    },
    {
      name: "_in fails when list omits version",
      where: { terraformVersion: { _in: ["1.4.0", "1.6.0"] } },
      expected: false,
    },
    {
      name: "_nin succeeds when list omits version",
      where: { terraformVersion: { _nin: ["1.4.0", "1.6.0"] } },
      expected: true,
    },
    {
      name: "_nin fails when list contains version",
      where: { terraformVersion: { _nin: ["1.5.0", "1.6.0"] } },
      expected: false,
    },
    {
      name: "_gt succeeds when version is greater",
      where: { terraformVersion: { _gt: "1.4.9" } },
      expected: true,
    },
    {
      name: "_gt fails when version is not greater",
      where: { terraformVersion: { _gt: "1.5.0" } },
      expected: false,
    },
    {
      name: "_gte succeeds when version equals threshold",
      where: { terraformVersion: { _gte: "1.5.0" } },
      expected: true,
    },
    {
      name: "_gte fails when version is lower",
      where: { terraformVersion: { _gte: "1.6.0" } },
      expected: false,
    },
    {
      name: "_lt succeeds when version is lower",
      where: { terraformVersion: { _lt: "1.6.0" } },
      expected: true,
    },
    {
      name: "_lt fails when version is not lower",
      where: { terraformVersion: { _lt: "1.5.0" } },
      expected: false,
    },
    {
      name: "_lte succeeds when version equals threshold",
      where: { terraformVersion: { _lte: "1.5.0" } },
      expected: true,
    },
  ];

  runCases(base, cases);
});

describe("evaluateWhereClause - logical combinations and nesting", () => {
  const base = {
    name: "example",
    count: 50,
    active: true,
    tags: {
      label: "primary",
      status: "open",
    },
    metadata: {
      owner: "alice",
      score: 90,
      nested: {
        flag: true,
      },
    },
  };

  const cases: FilteringTestCase[] = [
    {
      name: "_and succeeds when all conditions are true",
      where: {
        _and: [{ name: { _eq: "example" } }, { active: { _eq: true } }],
      },
      expected: true,
    },
    {
      name: "_and fails when any condition is false",
      where: {
        _and: [{ name: { _eq: "example" } }, { count: { _gt: 100 } }],
      },
      expected: false,
    },
    {
      name: "_or succeeds when any condition is true",
      where: {
        _or: [{ name: { _eq: "missing" } }, { active: { _eq: true } }],
      },
      expected: true,
    },
    {
      name: "_or fails when all conditions are false",
      where: {
        _or: [{ name: { _eq: "missing" } }, { count: { _lt: 10 } }],
      },
      expected: false,
    },
    {
      name: "_not succeeds when inner clause is false",
      where: { _not: { name: { _eq: "missing" } } },
      expected: true,
    },
    {
      name: "_not fails when inner clause is true",
      where: { _not: { active: { _eq: true } } },
      expected: false,
    },
    {
      name: "nested field comparison succeeds",
      where: { metadata: { owner: { _eq: "alice" } } },
      expected: true,
    },
    {
      name: "nested field comparison fails",
      where: { metadata: { owner: { _eq: "bob" } } },
      expected: false,
    },
    {
      name: "nested _and succeeds when all inner conditions match",
      where: {
        metadata: {
          _and: [{ owner: { _eq: "alice" } }, { score: { _eq: 90 } }],
        },
      },
      expected: true,
    },
    {
      name: "nested _and fails when an inner condition fails",
      where: {
        metadata: {
          _and: [{ owner: { _eq: "alice" } }, { score: { _gt: 100 } }],
        },
      },
      expected: false,
    },
    {
      name: "nested _or succeeds when any inner condition matches",
      where: {
        metadata: {
          _or: [{ owner: { _eq: "bob" } }, { score: { _eq: 90 } }],
        },
      },
      expected: true,
    },
    {
      name: "double nested comparison succeeds",
      where: { metadata: { nested: { flag: { _eq: true } } } },
      expected: true,
    },
    {
      name: "double nested comparison fails when value mismatches",
      where: { metadata: { nested: { flag: { _eq: false } } } },
      expected: false,
    },
    {
      name: "_and succeeds when combining boolean and numeric checks",
      where: {
        _and: [{ count: { _gte: 50 } }, { active: { _eq: true } }],
      },
      expected: true,
    },
    {
      name: "_and fails when any combined condition fails",
      where: {
        _and: [{ count: { _lte: 30 } }, { active: { _eq: true } }],
      },
      expected: false,
    },
    {
      name: "_or succeeds when including a nested _not clause",
      where: {
        _or: [
          { _not: { active: { _eq: false } } },
          { name: { _eq: "missing" } },
        ],
      },
      expected: true,
    },
    {
      name: "nested _not succeeds when inner comparison fails",
      where: { metadata: { _not: { owner: { _eq: "bob" } } } },
      expected: true,
    },
    {
      name: "a missing where clause defaults to true",
      where: undefined,
      expected: true,
    },
    {
      name: "a defined where clause fails when object is undefined",
      where: { name: { _eq: "example" } },
      expected: false,
      object: undefined,
    },
  ];

  runCases(base, cases);
});
