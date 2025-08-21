import gql from 'graphql-tag';

const projectsSchema = gql`
    type ProjectPermissions {
        canRead: Boolean
        canUpdate: Boolean
        canDestroy: Boolean
        canCreateWorkspace: Boolean
        canMoveWorkspace: Boolean
        canMoveStack: Boolean
        canDeployNoCodeModules: Boolean
        canReadTeams: Boolean
        canManageTags: Boolean
        canManageTeams: Boolean
        canManageInHcp: Boolean
        canManageEphemeralWorkspaceForProjects: Boolean
        canManageVarsets: Boolean
    }

    type Project {
        id: ID!
        name: String!
        description: String
        createdAt: DateTime
        workspaceCount: Int
        teamCount: Int
        stackCount: Int
        autoDestroyActivityDuration: String
        permissions: ProjectPermissions
        organization: Organization
        #  TODO: Add fields for workspaces, stacks, teams, and varsets
        teamAccess(filter: ProjectTeamAccessFilter): [ProjectTeamAccess!]!
    }

    extend type Query {
        projects(organization: String!, filter: ProjectFilter): [Project!]!
    }

    input ProjectPermissionsFilter {
        _and: [ProjectPermissionsFilter!]
        _or: [ProjectPermissionsFilter!]
        _not: ProjectPermissionsFilter

        canRead: BooleanComparisonExp
        canUpdate: BooleanComparisonExp
        canDestroy: BooleanComparisonExp
        canCreateWorkspace: BooleanComparisonExp
        canMoveWorkspace: BooleanComparisonExp
        canMoveStack: BooleanComparisonExp
        canDeployNoCodeModules: BooleanComparisonExp
        canReadTeams: BooleanComparisonExp
        canManageTags: BooleanComparisonExp
        canManageTeams: BooleanComparisonExp
        canManageInHcp: BooleanComparisonExp
        canManageEphemeralWorkspaceForProjects: BooleanComparisonExp
        canManageVarsets: BooleanComparisonExp
    }

    input ProjectFilter {
        _and: [ProjectFilter!]
        _or: [ProjectFilter!]
        _not: ProjectFilter

        id: StringComparisonExp
        name: StringComparisonExp
        description: StringComparisonExp
        createdAt: DateTimeComparisonExp
        workspaceCount: IntComparisonExp
        teamCount: IntComparisonExp
        stackCount: IntComparisonExp
        autoDestroyActivityDuration: StringComparisonExp
        permissions: ProjectPermissionsFilter
    }
`;

export default projectsSchema;