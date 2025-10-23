# Docker

Build and run the TFGQL server in a Docker container. The published image uses
the standard Node.js runtime (Alpine base) so that you can extend it with
additional tooling if needed.

## Build the Docker image

```bash
npm run docker:build
```

This uses Docker Buildx to build multi-platform images (amd64 and arm64).

## Run the container

```bash
docker run -p 4000:4000 --env-file .env tfgql
```

The server will listen on port 4000 by default.
