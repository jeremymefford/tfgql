import { DomainMapper } from '../common/middleware/domainMapper';
import { VariableSet, VariableSetResource } from './types';

export const variableSetMapper: DomainMapper<VariableSetResource, VariableSet> = {
    map(resource: VariableSetResource): VariableSet {
        return {
            id: resource.id,
            name: resource.attributes.name,
            description: resource.attributes.description,
            global: resource.attributes.global,
            updatedAt: resource.attributes['updated-at'],
            varCount: resource.attributes['var-count'],
            workspaceCount: resource.attributes['workspace-count'],
            projectCount: resource.attributes['project-count'],
            priority: resource.attributes.priority,
            permissions: {
                canUpdate: resource.attributes.permissions['can-update']
            },
            organizationId: resource.relationships.organization.data.id,
            variableIds: resource.relationships.vars?.data.map(v => v.id) ?? [],
            workspaceIds: resource.relationships.workspaces?.data.map(w => w.id) ?? [],
            projectIds: resource.relationships.projects?.data.map(p => p.id) ?? []
        };
    }
};