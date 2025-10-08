# Contributing to TFCE GraphQL

Thank you for your interest in contributing to the TFCE GraphQL project! We welcome your input and collaboration. Please follow the guidelines below to ensure a smooth development process.

---

## Getting Started

1. **Fork the repository** and clone it to your local machine.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the project root and configure required environment variables (e.g., `TFC_TOKEN`, `TFE_BASE_URL`, etc.).
4. Build and start the project with:

   ```bash
   npm install
   npm start
   ```

---

## Code Style and Standards

- This project uses **TypeScript** with strict type checking enabled.
- All source files are located under the `/src` directory and are organized by **domain**.
- Use **ESLint** to ensure code quality: run `npm run lint`.
- Ensure your code is **formatted** using **Prettier**: run `npm run format`.

---

## Writing Tests

- We use **Vitest** for testing and `nock` for mocking HTTP calls.
- Unit tests should live in the `tests/` folder, mirroring the source file structure.
- Write tests for new features and regression tests for bug fixes.
- Run the test suite with `npm run test`.

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

- Build with `npm run docker:build`.
- A lightweight, multi-arch Dockerfile is provided for secure production use.
- Run the container locally using: `docker run -p 4000:4000 tfce-graphql`.

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

---

## Submitting a PR

1. Make sure all tests pass: `npm run test`.
2. Ensure linter and formatter are clean.
3. Push your branch and open a pull request.
4. Clearly explain what the change does and why.

---

## Need Help?

Open an issue or reach out via the discussion board. We appreciate your help improving TFCE GraphQL!