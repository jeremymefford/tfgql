# syntax=docker/dockerfile:1.7-labs

# 1) Builder: install dev deps and compile TypeScript
FROM --platform=$BUILDPLATFORM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

COPY . .
RUN npm run compile

# 2) Runtime: only production deps + compiled output
FROM --platform=$TARGETPLATFORM node:24-alpine AS runtime

ARG VERSION="0.0.0"
ARG VCS_REF="unknown"
ARG BUILD_DATE="unknown"

LABEL org.opencontainers.image.title="tfce-graphql" \
      org.opencontainers.image.description="GraphQL facade for Terraform Cloud/Enterprise" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.source="https://github.com/jeremymefford/tfce-graphql" \
      org.opencontainers.image.licenses="MIT"

WORKDIR /app

RUN apk update && apk upgrade \
    && apk add --no-cache tini \
    && mkdir -p /app/tmp \
    && chown -R node:node /app \
    && chgrp -R 0 /app \
    && chmod -R g=u /app

# Default runtime configuration (override at run time as needed)
ENV NODE_ENV=production \
    LOG_LEVEL=info \
    TFE_BASE_URL=https://app.terraform.io/api/v2 \
    TFCE_GRAPHQL_BATCH_SIZE=10 \
    TFCE_GRAPHQL_PAGE_SIZE=100 \
    TFCE_GRAPHQL_RATE_LIMIT_MAX_RETRIES=50 \
    TFCE_GRAPHQL_SERVER_ERROR_MAX_RETRIES=20 \
    TFCE_GRAPHQL_SERVER_ERROR_RETRY_DELAY=60000 \
    TFCE_GRAPHQL_REQUEST_CACHE_MAX_SIZE=5000 \
    PORT=4000 \
    NODE_OPTIONS=--enable-source-maps

# Note: TFC_TOKEN must be provided at runtime (no default)

COPY --chown=node:node package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

# Copy compiled application only
COPY --from=builder --chown=node:node /app/dist ./dist

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "const p=(process.env.PORT||'4000'); const u='http://127.0.0.1:'+p+'/graphql?query=%7B__typename%7D'; fetch(u,{headers:{'apollo-require-preflight':'true'}}).then(r=>r.ok?r.json():Promise.reject()).then(j=>{if(!(j&&j.data&&typeof j.data.__typename==='string'&&j.data.__typename.length))process.exit(1)}).catch(()=>process.exit(1))"]

USER node

EXPOSE 4000

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "dist/index.js"]
