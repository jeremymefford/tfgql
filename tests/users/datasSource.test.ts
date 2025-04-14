import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import { UsersAPI } from '../../src/users/dataSource';
import { User } from '../../src/users/types';

describe('UsersAPI (nock)', () => {
  let usersAPI: UsersAPI;
  const mockUser: User = {
    id: 'user-123',
    username: 'testuser',
    email: 'anon@example.com',
    avatarUrl: 'https://example.com/avatar.png',
    isServiceAccount: false,
    authMethod: 'tfc',
    v2Only: true,
    permissions: {
      canCreateOrganizations: true,
      canViewSettings: true,
      canViewProfile: true,
      canChangeEmail: true,
      canChangeUsername: true,
      canChangePassword: true,
      canManageSessions: true,
      canManageSsoIdentities: false,
      canManageUserTokens: true,
      canUpdateUser: true,
      canReenable2faByUnlinking: true,
      canManageHcpAccount: false
    }
  };

  const baseUrl = 'https://app.terraform.io/api/v2';

  beforeEach(() => {
    usersAPI = new UsersAPI();
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('getUser should fetch user by ID and return mapped response', async () => {
    nock(baseUrl)
      .get('/users/user-123')
      .reply(200, {
        data: {
          id: mockUser.id,
          type: 'users',
          attributes: {
            username: mockUser.username,
            email: mockUser.email,
            'avatar-url': mockUser.avatarUrl,
            'is-service-account': mockUser.isServiceAccount,
            'auth-method': mockUser.authMethod,
            'v2-only': mockUser.v2Only,
            permissions: {
              'can-create-organizations': mockUser.permissions.canCreateOrganizations,
              'can-view-settings': mockUser.permissions.canViewSettings,
              'can-view-profile': mockUser.permissions.canViewProfile,
              'can-change-email': mockUser.permissions.canChangeEmail,
              'can-change-username': mockUser.permissions.canChangeUsername,
              'can-change-password': mockUser.permissions.canChangePassword,
              'can-manage-sessions': mockUser.permissions.canManageSessions,
              'can-manage-sso-identities': mockUser.permissions.canManageSsoIdentities,
              'can-manage-user-tokens': mockUser.permissions.canManageUserTokens,
              'can-update-user': mockUser.permissions.canUpdateUser,
              'can-reenable-2fa-by-unlinking': mockUser.permissions.canReenable2faByUnlinking,
              'can-manage-hcp-account': mockUser.permissions.canManageHcpAccount
            }
          },
          relationships: {
            'authentication-tokens': {
              links: {
                related: '/api/v2/users/user-123/authentication-tokens'
              }
            },
            'github-app-oauth-tokens': {
              links: {
                related: '/api/v2/users/user-123/github-app-oauth-tokens'
              }
            }
          },
          links: {
            self: '/api/v2/users/user-123'
          }
        }
      });

    const result = await usersAPI.getUser('user-123');
    expect(result).toEqual(mockUser);
  });

  it('getCurrentUser should fetch current user and return mapped response', async () => {
    nock(baseUrl)
      .get('/account/details')
      .reply(200, {
        data: {
          id: mockUser.id,
          type: 'users',
          attributes: {
            username: mockUser.username,
            email: mockUser.email,
            'avatar-url': mockUser.avatarUrl,
            'is-service-account': mockUser.isServiceAccount,
            'auth-method': mockUser.authMethod,
            'v2-only': mockUser.v2Only,
            permissions: {
              'can-create-organizations': mockUser.permissions.canCreateOrganizations,
              'can-view-settings': mockUser.permissions.canViewSettings,
              'can-view-profile': mockUser.permissions.canViewProfile,
              'can-change-email': mockUser.permissions.canChangeEmail,
              'can-change-username': mockUser.permissions.canChangeUsername,
              'can-change-password': mockUser.permissions.canChangePassword,
              'can-manage-sessions': mockUser.permissions.canManageSessions,
              'can-manage-sso-identities': mockUser.permissions.canManageSsoIdentities,
              'can-manage-user-tokens': mockUser.permissions.canManageUserTokens,
              'can-update-user': mockUser.permissions.canUpdateUser,
              'can-reenable-2fa-by-unlinking': mockUser.permissions.canReenable2faByUnlinking,
              'can-manage-hcp-account': mockUser.permissions.canManageHcpAccount
            }
          },
          relationships: {
            'authentication-tokens': {
              links: {
                related: '/api/v2/users/user-123/authentication-tokens'
              }
            },
            'github-app-oauth-tokens': {
              links: {
                related: '/api/v2/users/user-123/github-app-oauth-tokens'
              }
            }
          },
          links: {
            self: '/api/v2/users/user-123'
          }
        }
      });

    const result = await usersAPI.getCurrentUser();
    expect(result).toEqual(mockUser);
  });
});