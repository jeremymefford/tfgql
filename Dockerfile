FROM debian:bookworm-slim

ARG TARGETARCH
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

RUN apt-get update && apt-get install -y --no-install-recommends tini wget \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system tfgql && useradd --system --gid tfgql tfgql

WORKDIR /app

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
    PORT=4000

COPY --chown=tfgql:tfgql tfgql-linux-${TARGETARCH} /app/tfgql
RUN chmod +x /app/tfgql

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["sh", "-c", "wget -qO- http://127.0.0.1:${PORT:-4000}/health | grep -q '\"status\":\"ok\"' || exit 1"]

USER tfgql

EXPOSE 4000

ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["/app/tfgql"]
