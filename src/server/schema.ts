import fs from 'fs';
import path from 'path';
import { gql } from 'graphql-tag';
import { DateTimeScalar } from '../common/scalars/dateTime';
import { resolvers as organizationsResolvers } from '../organizations/resolvers';
import { resolvers as workspacesResolvers } from '../workspaces/resolvers';
import { resolvers as usersResolvers } from '../users/resolvers';
import { resolvers as runsResolvers } from '../runs/resolvers';
import { resolvers as teamsResolvers } from '../teams/resolvers';
import { resolvers as configurationVersionResolvers } from '../configuration-versions/resolvers';
import { resolvers as variableSetResolvers } from '../variable-sets/resolvers';
import { resolvers as projectsResolvers } from '../projects/resolvers';
import { resolvers as variableResolvers } from '../variables/resolvers';
import { resolvers as workspaceResourceResolvers } from '../workspace-resources/resolvers';
import configurationVersionSchema from '../configuration-versions/schema';
import organizationSchema from '../organizations/schema';
import workspaceSchema from '../workspaces/schema';
import userSchema from '../users/schema';
import runSchema from '../runs/schema';
import teamSchema from '../teams/schema';
import filterSchema from '../common/filtering/schema';
import variableSetSchema from '../variable-sets/schema';
import variableSchema from '../variables/schema';
import projectsSchema from '../projects/schema';
import workspaceResourcesSchema from '../workspace-resources/schema';

/** Utility to load a schema file as a GraphQL string */
const loadSchema = (relativePath: string): string => {
  const schemaPath = path.join(__dirname, '..', relativePath);
  return fs.readFileSync(schemaPath, 'utf8');
};

// Base schema definitions for root types and custom scalar
const baseSchema = gql`
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
  workspaceResourcesSchema
];

/** Combined resolvers for all types (queries, mutations, and custom scalars) */
export const resolvers = {
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
    ...workspaceResourceResolvers.Query
  },
  Organization: {
    ...organizationsResolvers.Organization
  },
  Workspace: {
    ...workspacesResolvers.Workspace,
    ...workspaceResourceResolvers.Workspace
  },
  Team: {
    ...teamsResolvers.Team
  },
  Run: {
    ...runsResolvers.Run
  },
  VariableSet: {
    ...variableSetResolvers.VariableSet
  },
  WorkspaceResource: {
    ...workspaceResourceResolvers.WorkspaceResource
  }
};