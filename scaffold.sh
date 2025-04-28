#!/bin/bash

# scaffold.sh - Generate GraphQL domain structure for a new domain object
# Usage: ./scaffold.sh <domain-name>

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <domain-name>"
  exit 1
fi

DOMAIN_RAW="$1"
DOMAIN_CAMEL=$(echo "$DOMAIN_RAW" | awk -F- '{ for(i=1;i<=NF;i++) { $i = tolower(substr($i,1,1)) substr($i,2) } }1' OFS="")
DOMAIN_PASCAL=$(echo "$DOMAIN_RAW" | awk -F- '{ for(i=1;i<=NF;i++) { $i = toupper(substr($i,1,1)) substr($i,2) } }1' OFS="")

SRC_DIR="./src/${DOMAIN_RAW}"
TEST_DIR="./tests/${DOMAIN_RAW}"

mkdir -p "$SRC_DIR"
mkdir -p "$TEST_DIR"

# schema.ts
cat > "${SRC_DIR}/schema.ts" <<EOF
import gql from 'graphql-tag';

export const ${DOMAIN_CAMEL}Schema = gql\`
type ${DOMAIN_PASCAL} {
    id: ID!
    # Add other fields
}

extend type Query {
    ${DOMAIN_CAMEL}s: [${DOMAIN_PASCAL}!]!
}
\`;
EOF

# types.ts
cat > "${SRC_DIR}/types.ts" <<EOF
import { ResourceObject, ListResponse, SingleResponse } from '../common/types/jsonApi';

export interface ${DOMAIN_PASCAL}Attributes {
    // Define attributes
}

export type ${DOMAIN_PASCAL}Resource = ResourceObject<${DOMAIN_PASCAL}Attributes>;
export type ${DOMAIN_PASCAL}Response = SingleResponse<${DOMAIN_PASCAL}Resource>;
export type ${DOMAIN_PASCAL}ListResponse = ListResponse<${DOMAIN_PASCAL}Resource>;

export interface ${DOMAIN_PASCAL} {
    id: string;
    // Add fields here
}
EOF

# dataSource.ts
cat > "${SRC_DIR}/dataSource.ts" <<EOF
import { axiosClient } from '../common/httpClient';
import { ${DOMAIN_PASCAL}, ${DOMAIN_PASCAL}Response } from './types';
import { ${DOMAIN_CAMEL}Mapper } from './mapper';

export class ${DOMAIN_PASCAL}API {
    async get${DOMAIN_PASCAL}(id: string): Promise<${DOMAIN_PASCAL}> {
        const res = await axiosClient.get<${DOMAIN_PASCAL}Response>(\`/${DOMAIN_RAW}s/\${id}\`);
        return ${DOMAIN_CAMEL}Mapper.map(res.data.data);
    }
}
EOF

# resolvers.ts
cat > "${SRC_DIR}/resolvers.ts" <<EOF
import { Context } from '../server/context';
import { ${DOMAIN_PASCAL} } from './types';

export const resolvers = {
    Query: {
        ${DOMAIN_CAMEL}s: async (_: unknown, __: unknown, { dataSources }: Context): Promise<${DOMAIN_PASCAL}[]> => {
            return [];
        }
    }
};
EOF

# mapper.ts
cat > "${SRC_DIR}/mapper.ts" <<EOF
import { ${DOMAIN_PASCAL}, ${DOMAIN_PASCAL}Resource } from './types';

export const ${DOMAIN_CAMEL}Mapper = {
    map(resource: ${DOMAIN_PASCAL}Resource): ${DOMAIN_PASCAL} {
        return {
            id: resource.id
            // Map attributes here
        };
    }
};
EOF

# Basic test file
cat > "${TEST_DIR}/dataSource.test.ts" <<EOF
import { describe, it, expect } from 'vitest';
import { ${DOMAIN_PASCAL}API } from '../../src/${DOMAIN_RAW}/dataSource';

describe('${DOMAIN_PASCAL}API', () => {
    it('should instantiate properly', () => {
        const api = new ${DOMAIN_PASCAL}API();
        expect(api).toBeDefined();
    });
});
EOF

echo "✅ Scaffolding for '${DOMAIN_RAW}' created under ./src and ./tests"