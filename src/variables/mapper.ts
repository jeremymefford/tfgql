import { DomainMapper } from '../common/middleware/domainMapper';
import { Variable, VariableResource } from './types';

export const variablesMapper: DomainMapper<VariableResource, Variable> = {
    map(resource: VariableResource): Variable {
        return {
            id: resource.id,
            key: resource.attributes.key,
            value: resource.attributes.value,
            sensitive: resource.attributes.sensitive,
            category: resource.attributes.category,
            hcl: resource.attributes.hcl,
            description: resource.attributes.description,
            createdAt: resource.attributes['created-at'],
            versionId: resource.attributes['version-id'],
            workspaceId: resource.relationships?.workspace?.data?.id,
        };
    }
};
