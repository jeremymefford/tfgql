import fs from 'fs';
import path from 'path';
import { gql } from 'graphql-tag';
import { DateTimeScalar } from '../common/scalars/dateTime';
import { resolvers as organizationsResolvers } from '../organizations/resolvers';
import { resolvers as workspacesResolvers } from '../workspaces/resolvers';
import { resolvers as usersResolvers } from '../users/resolvers';
import { resolvers as runsResolvers } from '../runs/resolvers';
import { resolvers as teamsResolvers } from '../teams/resolvers';
import { resolvers as configurationVersionResolvers } from '../configurationVersions/resolvers';
import { resolvers as variableSetResolvers } from '../variableSets/resolvers';
import { resolvers as projectsResolvers } from '../projects/resolvers';
import { resolvers as variableResolvers } from '../variables/resolvers';
import { resolvers as workspaceResourceResolvers } from '../workspaceResources/resolvers';
import { resolvers as agentPoolsResolvers } from '../agentPools/resolvers';
import { resolvers as agentTokensResolvers } from '../agentTokens/resolvers';
import { resolvers as agentsResolvers } from '../agents/resolvers';
import { resolvers as appliesResolvers } from '../applies/resolvers';
import { resolvers as assessmentResultsResolvers } from '../assessmentResults/resolvers';
import { resolvers as commentsResolvers } from '../comments/resolvers';
import { resolvers as organizationMembershipsResolvers } from '../organizationMemberships/resolvers';
import { resolvers as organizationTagsResolvers } from '../organizationTags/resolvers';
import { resolvers as plansResolvers } from '../plans/resolvers';
import { resolvers as policiesResolvers } from '../policies/resolvers';
import { resolvers as policySetsResolvers } from '../policySets/resolvers';
import { resolvers as policyEvaluationsResolvers } from '../policyEvaluations/resolvers';
import { resolvers as policySetParametersResolvers } from '../policySetParameters/resolvers';
import { resolvers as projectTeamAccessResolvers } from '../projectTeamAccess/resolvers';
import { resolvers as stateVersionOutputsResolvers } from '../stateVersionOutputs/resolvers';
import { resolvers as stateVersionsResolvers } from '../stateVersions/resolvers';
import { resolvers as runTriggersResolvers } from '../runTriggers/resolvers';
import { resolvers as teamTokensResolvers } from '../teamTokens/resolvers';
import { resolvers as teamAccessResolvers } from '../workspaceTeamAccess/resolvers';
import configurationVersionSchema from '../configurationVersions/schema';
import organizationSchema from '../organizations/schema';
import workspaceSchema from '../workspaces/schema';
import userSchema from '../users/schema';
import runSchema from '../runs/schema';
import teamSchema from '../teams/schema';
import filterSchema from '../common/filtering/schema';
import variableSetSchema from '../variableSets/schema';
import variableSchema from '../variables/schema';
import projectsSchema from '../projects/schema';
import workspaceResourcesSchema from '../workspaceResources/schema';
import agentPoolsSchema from '../agentPools/schema';
import agentTokensSchema from '../agentTokens/schema';
import agentSchema from '../agents/schema';
import appliesSchema from '../applies/schema';
import assessmentResultsSchema from '../assessmentResults/schema';
import commentsSchema from '../comments/schema';
import organizationMembershipsSchema from '../organizationMemberships/schema';
import organizationTagsSchema from '../organizationTags/schema';
import plansSchema from '../plans/schema';
import policiesSchema from '../policies/schema';
import policySetsSchema from '../policySets/schema';
import policyEvaluationsSchema from '../policyEvaluations/schema';
import policySetParametersSchema from '../policySetParameters/schema';
import projectTeamAccessSchema from '../projectTeamAccess/schema';
import stateVersionOutputsSchema from '../stateVersionOutputs/schema';
import runTriggersSchema from '../runTriggers/schema';
import teamTokensSchema from '../teamTokens/schema';
import teamAccessSchema from '../workspaceTeamAccess/schema';
import stateVersionsSchema from '../stateVersions/schema';
import { Config } from '../common/conf';

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
  workspaceResourcesSchema,
  agentPoolsSchema,
  agentTokensSchema,
  agentSchema,
  appliesSchema,
  assessmentResultsSchema,
  commentsSchema,
  organizationMembershipsSchema,
  organizationTagsSchema,
  plansSchema,
  policiesSchema,
  policySetsSchema,
  policyEvaluationsSchema,
  policySetParametersSchema,
  projectTeamAccessSchema,
  stateVersionOutputsSchema,
  stateVersionsSchema,
  runTriggersSchema,
  teamTokensSchema,
  teamAccessSchema
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
    ...workspaceResourceResolvers.Query,
    ...agentPoolsResolvers.Query,
    ...agentTokensResolvers.Query,
    ...agentsResolvers.Query,
    ...appliesResolvers.Query,
    ...assessmentResultsResolvers.Query,
    ...commentsResolvers.Query,
    ...organizationMembershipsResolvers.Query,
    ...organizationTagsResolvers.Query,
    ...plansResolvers.Query,
    ...policiesResolvers.Query,
    ...policySetsResolvers.Query,
    ...policyEvaluationsResolvers.Query,
    ...policySetParametersResolvers.Query,
    ...projectTeamAccessResolvers.Query,
    ...stateVersionOutputsResolvers.Query,
    ...stateVersionsResolvers.Query,
    ...runTriggersResolvers.Query,
    ...teamTokensResolvers.Query,
    ...teamAccessResolvers.Query
  },
  Organization: {
    ...organizationsResolvers.Organization
  },
  Workspace: {
    ...workspacesResolvers.Workspace,
  },
  Team: {
    ...teamsResolvers.Team
  },
  Run: {
    ...runsResolvers.Run
  },
  Plan: {
    ...plansResolvers.Plan
  },
  PolicySet: {
    ...policySetsResolvers.PolicySet
  },
  VariableSet: {
    ...variableSetResolvers.VariableSet
  },
  WorkspaceResource: {
    ...workspaceResourceResolvers.WorkspaceResource
  },
  ConfigurationVersion: {
    ...configurationVersionResolvers.ConfigurationVersion
  },
  Project: {
    ...projectsResolvers.Project
  },
  AgentPool: {
    ...agentPoolsResolvers.AgentPool
  },
  RunTrigger: {
    ...runTriggersResolvers.RunTrigger
  },
  StateVersion: {
    ...stateVersionsResolvers.StateVersion
  },
  Apply: {
    ...appliesResolvers.Apply
  }
};