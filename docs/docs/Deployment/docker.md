# Docker

Build and run the TFCE GraphQL server in a Docker container.

## Build the Docker image

```bash
npm run docker:build
```

This uses Docker Buildx to build multi-platform images (amd64 and arm64).

## Run the container

```bash
docker run -p 4000:4000 --env-file .env tfce-graphql
```

The server will listen on port 4000 by default.