import { describe, it, expect, vi } from 'vitest';
import { resolvers } from '../../src/users/resolvers';
import { Context } from '../../src/server/context';
import { User } from '../../src/users/types';

describe('User resolvers', () => {
    const mockUser: User = {
        id: 'user-123',
        username: 'testuser',
        email: 'testuser@example.com',
        avatarUrl: 'https://example.com/avatar.png',
        isServiceAccount: false,
        authMethod: 'password',
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

    const mockDataSources = {
        usersAPI: {
            getUser: vi.fn().mockResolvedValue(mockUser),
            getCurrentUser: vi.fn().mockResolvedValue(mockUser)
        }
    };

    const mockContext = { dataSources: mockDataSources } as unknown as Context;

    it('resolves user by ID', async () => {
        const result = await resolvers.Query.user?.(
            {},
            { id: 'user-123' },
            mockContext
        );

        expect(mockDataSources.usersAPI.getUser).toHaveBeenCalledWith('user-123');
        expect(result).toEqual(mockUser);
        expect(result?.email).toBe('testuser@example.com');
        expect(result?.avatarUrl).toBe('https://example.com/avatar.png');
        expect(result?.isServiceAccount).toBe(false);
        expect(result?.authMethod).toBe('password');
        expect(result?.v2Only).toBe(true);
        expect(result?.permissions.canCreateOrganizations).toBe(true);
        expect(result?.permissions.canViewSettings).toBe(true);
        expect(result?.permissions.canViewProfile).toBe(true);
        expect(result?.permissions.canChangeEmail).toBe(true);
        expect(result?.permissions.canChangeUsername).toBe(true);
        expect(result?.permissions.canChangePassword).toBe(true);
        expect(result?.permissions.canManageSessions).toBe(true);
        expect(result?.permissions.canManageSsoIdentities).toBe(false);
        expect(result?.permissions.canManageUserTokens).toBe(true);
        expect(result?.permissions.canUpdateUser).toBe(true);
        expect(result?.permissions.canReenable2faByUnlinking).toBe(true);
        expect(result?.permissions.canManageHcpAccount).toBe(false);
    });

    it('resolves current user with "me"', async () => {
        const result = await resolvers.Query.me?.(
            {},
            {},
            mockContext
        );

        expect(mockDataSources.usersAPI.getCurrentUser).toHaveBeenCalled();
        expect(result).toEqual(mockUser);
        expect(result?.email).toBe('testuser@example.com');
        expect(result?.avatarUrl).toBe('https://example.com/avatar.png');
        expect(result?.isServiceAccount).toBe(false);
        expect(result?.authMethod).toBe('password');
        expect(result?.v2Only).toBe(true);
        expect(result?.permissions.canCreateOrganizations).toBe(true);
        expect(result?.permissions.canViewSettings).toBe(true);
        expect(result?.permissions.canViewProfile).toBe(true);
        expect(result?.permissions.canChangeEmail).toBe(true);
        expect(result?.permissions.canChangeUsername).toBe(true);
        expect(result?.permissions.canChangePassword).toBe(true);
        expect(result?.permissions.canManageSessions).toBe(true);
        expect(result?.permissions.canManageSsoIdentities).toBe(false);
        expect(result?.permissions.canManageUserTokens).toBe(true);
        expect(result?.permissions.canUpdateUser).toBe(true);
        expect(result?.permissions.canReenable2faByUnlinking).toBe(true);
        expect(result?.permissions.canManageHcpAccount).toBe(false);
    });
});