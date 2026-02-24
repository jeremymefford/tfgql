# syntax=docker/dockerfile:1.7-labs

# 1) Builder: install dev deps and compile TypeScript
FROM --platform=$BUILDPLATFORM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

COPY . .
RUN npm run compile

# 2) Prod deps: install production dependencies once
FROM --platform=$BUILDPLATFORM node:24-alpine AS prod-deps
WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev --no-audit --no-fund

# 3) Runtime: official Node image with only runtime deps + compiled output
FROM --platform=$TARGETPLATFORM node:24-alpine AS runtime

ARG VERSION="0.0.0"
ARG VCS_REF="unknown"
ARG BUILD_DATE="unknown"

LABEL org.opencontainers.image.title="tfgql" \
      org.opencontainers.image.description="GraphQL facade for Terraform Cloud/Enterprise" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.source="https://github.com/jeremymefford/tfgql" \
      org.opencontainers.image.licenses="MIT"

WORKDIR /app

RUN apk add --no-cache tini \
    && rm -rf /usr/local/lib/node_modules/npm \
    && rm -f /usr/local/bin/npm /usr/local/bin/npx \
    && rm -rf /usr/local/lib/node_modules/corepack \
    && rm -f /usr/local/bin/corepack

# Default runtime configuration (override at run time as needed)
ENV NODE_ENV=production \
    LOG_LEVEL=info \
    TFE_BASE_URL=https://app.terraform.io/api/v2 \
    TFGQL_BATCH_SIZE=10 \
    TFGQL_PAGE_SIZE=100 \
    TFGQL_RATE_LIMIT_MAX_RETRIES=50 \
    TFGQL_SERVER_ERROR_MAX_RETRIES=20 \
    TFGQL_SERVER_ERROR_RETRY_DELAY=60000 \
    TFGQL_REQUEST_CACHE_MAX_SIZE=5000 \
    PORT=4000 \
    NODE_OPTIONS=--enable-source-maps

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/docs/static/img/logo.svg ./docs/static/img/logo.svg

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "const p=(process.env.PORT||'4000'); const u='http://127.0.0.1:'+p+'/health'; fetch(u).then(r=>r.ok?r.json():Promise.reject()).then(j=>{if(!(j&&j.status==='ok'))process.exit(1)}).catch(()=>process.exit(1))"]

USER node

EXPOSE 4000

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "dist/index.js"]
