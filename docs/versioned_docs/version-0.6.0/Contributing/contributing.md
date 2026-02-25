# Contributing to TFGQL

Thank you for your interest in contributing to the TFGQL project! We welcome your input and collaboration. Please follow the guidelines below to ensure a smooth development process.

---

## Getting Started

1. **Fork the repository** and clone it locally.
2. Use **Node.js 24** (`nvm use 24` recommended) and install dependencies with `npm install`.
3. Set the required environment variables (e.g., `TFGQL_JWT_ENCRYPTION_KEY`, `TFE_BASE_URL`, `PORT`) in your shell or a `.env.local` file.
4. Start the API with:

   ```bash
   npm start
   ```

5. (Optional) Build a single executable for your architecture to sanity-check SEA output:

   ```bash
   npm run build:sea -- --scope=current
   ./build/sea/binaries/tfgql-<platform>
   ```

---

## Code Style and Standards

- This project uses **TypeScript** with strict type checking enabled.
- All source files are located under the `/src` directory and are organized by **domain**.
- Use **ESLint** to ensure code quality: run `npm run lint`.
- Ensure your code is **formatted** using **Prettier**: run `npm run format`.

---

## Commits and Branches

- Use **feature branches** from `main` or `develop`: `feature/short-description`.
- Use **clear commit messages**. Prefer imperative style: “Add support for workspace resources”.

---

## GraphQL Schema

- Use the `schema.ts` files with `gql` template literals for defining types.
* Use the `filter` argument for all entity filters (nested filters are supported via composed `*Filter` types).
* Define type definitions in the `schema.ts` files and register them along with resolvers in `src/server/schema.ts`.

---

## Data Sources and Mappers

- Place new API interaction logic under `/src/<domain>/dataSource.ts`.
- Map API responses to internal types using a `mapper.ts` file.
- Define types in `types.ts` using API-aligned `*Attributes` and mapped types.

---

## Docker and Deployment

- Build the Linux image with `npm run docker:build`.
- The published image targets Linux (`linux/amd64` and `linux/arm64`). On macOS/Windows use Docker Desktop in Linux mode.
- Run the container locally using:

  ```bash
  docker run -p 4000:4000 ghcr.io/jeremymefford/tfgql:latest
  ```

---

## Documentation

* Project uses **Docusaurus** for documentation under `/docs`.
* Add or edit pages in the relevant folder under `docs/docs/`.
* Run the docs locally with:

  ```bash
  cd docs
  npm install
  npm start
  ```

---

## Request Caching

- A request-level cache exists for resolver optimization.
- Use `context.requestCache.getOrSet(entity, id, fetchFn)` to prevent redundant calls.
:::warning
Not every API needs to be cached and they are only cached PER request.  This is to prevent making the same
call many times when trying to resolve the same nested entity across multiple parent entities.
:::

---

## Submitting a PR

1. Ensure linter and formatter are clean.
2. Push your branch and open a pull request, make sure the title of the pull request starts with `[MAJOR]` / `[MINOR]` / `[PATCH]` as this is used to determine how to bump the version.
3. Clearly explain what the change does and why.
4. If your change affects the Homebrew formula or release artifacts, note it in the PR description so the maintainers can verify the release workflow.
