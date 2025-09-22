import { gql } from 'graphql-tag';

const variableSetSchema = gql`
    type VariableSet {
        id: ID!
        name: String!
        description: String
        global: Boolean!
        updatedAt: DateTime!
        varCount: Int!
        workspaceCount: Int!
        projectCount: Int!
        priority: Boolean!
        permissions: VariableSetPermissions!

        organization: Organization
        vars(filter: VariableFilter): [Variable!]
        workspaces(filter: WorkspaceFilter): [Workspace!]
        projects(filter: ProjectFilter): [Project!]
    }

    type VariableSetPermissions {
        canUpdate: Boolean!
    }

    extend type Query {
        variableSets(organization: String!, filter: VariableSetFilter): [VariableSet!]!
        variableSet(id: ID!): VariableSet
    }

    input VariableSetFilter {
        _and: [VariableSetFilter!]
        _or: [VariableSetFilter!]
        _not: VariableSetFilter

        id: StringComparisonExp
        name: StringComparisonExp
        description: StringComparisonExp
        global: BooleanComparisonExp
        updatedAt: DateTimeComparisonExp
        varCount: IntComparisonExp
        workspaceCount: IntComparisonExp
        projectCount: IntComparisonExp
        priority: BooleanComparisonExp
        permissions: VariableSetPermissionsFilter
    }

    input VariableSetPermissionsFilter {
        canUpdate: BooleanComparisonExp
    }
`;
export default variableSetSchema;