# Getting Started with TFCE GraphQL

Welcome to the comprehensive guide for getting started with the **TFCE GraphQL** project. This guide will walk you through everything from installation and setup to advanced querying techniques, helping you make the most of the TFCE GraphQL API.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Installation and Setup](#installation-and-setup)  
   - [Prerequisites](#prerequisites)  
   - [Cloning the Repository](#cloning-the-repository)  
   - [Environment Configuration](#environment-configuration)  
3. [Starting the Server Locally](#starting-the-server-locally)  
4. [Exploring the Schema](#exploring-the-schema)  
5. [Basic Queries](#basic-queries)  
   - [Listing Organizations](#listing-organizations)  
   - [Listing Teams](#listing-teams)  
6. [Using Filters and Sorting](#using-filters-and-sorting)  
7. [Advanced Querying](#advanced-querying)  
   - [Pagination](#pagination)  
   - [Nested Relationships](#nested-relationships)  
8. [Handling Rate Limits](#handling-rate-limits)  
9. [Sample GraphQL Queries with Explanations](#sample-graphql-queries-with-explanations)  
10. [Debugging and Extending Queries](#debugging-and-extending-queries)  
11. [Authentication and HCP/TFE Usage Notes](#authentication-and-hcptfe-usage-notes)  
12. [Final Checklist and Resources](#final-checklist-and-resources)  

---

## Project Overview

The **TFCE GraphQL** project provides a flexible and powerful GraphQL API interface for interacting with Terraform Cloud/Enterprise (TFC/E) resources such as organizations, teams, workspaces, runs, and more. It abstracts the underlying REST API into a more developer-friendly GraphQL schema, enabling you to fetch exactly the data you need with a single query.

Key features include:

- Access to TFC/E entities with rich querying capabilities  
- Support for filtering, sorting, and pagination  
- Rate-limit awareness and handling  
- Authentication support for secure API access  
- Extensible schema for future enhancements  

---

## Installation and Setup

### Prerequisites

Before you begin, ensure that you have the following installed on your development machine:

- **Node.js** (version 14 or higher recommended)  
- **npm** (comes with Node.js)  
- **Docker** (optional but recommended for containerized setup)  
- A **Terraform Cloud/Enterprise** account with API access token  

You can verify installations with:

```bash
node -v
npm -v
docker --version
```

### Cloning the Repository

Clone the TFCE GraphQL project repository from GitHub:

```bash
git clone https://github.com/your-org/tfce-graphql.git
cd tfce-graphql
```

### Environment Configuration

Create a `.env` file in the root directory to store your environment variables. At minimum, you need to specify your Terraform API token and optionally the API URL if you are using Terraform Enterprise.

Example `.env`:

```env
TFC_API_TOKEN=your_terraform_api_token_here
TFC_API_URL=https://app.terraform.io/api/v2  # default for Terraform Cloud
PORT=4000
```

**Note:** Keep your API token secure and do not commit `.env` files to source control.

---

## Starting the Server Locally

You can run the server either directly with Node.js or inside a Docker container.

### Running with Node.js

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

By default, the server listens on port 4000. You should see output similar to:

```
🚀 Server ready at http://localhost:4000/graphql
```

### Running with Docker

Build the Docker image:

```bash
docker build -t tfce-graphql .
```

Run the container:

```bash
docker run -p 4000:4000 --env-file .env tfce-graphql
```

---

## Exploring the Schema

Once the server is running, navigate to the GraphQL playground or your preferred GraphQL client at:

```
http://localhost:4000/graphql
```

The playground provides an interactive interface to explore the schema, run queries, and view documentation on types and fields.

Use the **Docs** tab to browse available queries, mutations, and types. This is a great way to familiarize yourself with the API capabilities.

---

## Basic Queries

### Listing Organizations

Fetch a list of organizations you have access to:

```graphql
query {
  organizations {
    id
    name
    email
    createdAt
  }
}
```

### Listing Teams

To list teams within a specific organization, use the organization ID:

```graphql
query {
  organization(id: "org-id-here") {
    teams {
      id
      name
      memberCount
    }
  }
}
```

---

## Using Filters and Sorting

The API supports filtering and sorting on many list queries.

### Example: Filter Organizations by Name

```graphql
query {
  organizations(filter: { nameContains: "dev" }) {
    id
    name
  }
}
```

### Example: Sort Teams by Name Descending

```graphql
query {
  organization(id: "org-id") {
    teams(sort: { field: NAME, order: DESC }) {
      id
      name
    }
  }
}
```

---

## Advanced Querying

### Pagination

Large datasets are paginated to improve performance. Use `first`, `last`, `before`, and `after` arguments to paginate.

Example: Fetch first 5 organizations:

```graphql
query {
  organizations(first: 5) {
    edges {
      node {
        id
        name
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

To fetch the next page, use the `endCursor` value with the `after` argument:

```graphql
query {
  organizations(first: 5, after: "cursor-value") {
    edges {
      node {
        id
        name
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Nested Relationships

GraphQL allows querying nested relationships in a single request.

Example: Fetch an organization with its teams and each team's members:

```graphql
query {
  organization(id: "org-id") {
    name
    teams {
      id
      name
      members {
        id
        username
        email
      }
    }
  }
}
```

---

## Handling Rate Limits

Terraform Cloud/Enterprise enforces API rate limits. The TFCE GraphQL server includes built-in awareness to help you handle these limits gracefully.

- If you approach the limit, the server may return errors indicating rate limit exhaustion.  
- Use exponential backoff and retry mechanisms in your client applications.  
- Monitor the `X-Ratelimit-Remaining` and `X-Ratelimit-Reset` headers if available.  

**Tip:** Avoid excessive polling and batch your queries where possible.

---

## Sample GraphQL Queries with Explanations

### Query 1: Get Workspace Details with Latest Run Status

```graphql
query {
  workspace(id: "ws-id") {
    name
    description
    latestRun {
      id
      status
      createdAt
      message
    }
  }
}
```

**Explanation:**  
This query fetches a workspace by ID and retrieves its name, description, and the latest run's status and message, enabling you to monitor recent activity.

---

### Query 2: List Runs with Filtering and Pagination

```graphql
query {
  runs(filter: { status: "applied" }, first: 10) {
    edges {
      node {
        id
        status
        createdAt
        workspace {
          name
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

**Explanation:**  
This fetches the first 10 runs with status "applied", including the workspace name for each run. Use `endCursor` to paginate further.

---

## Debugging and Extending Queries

- Use the GraphQL playground's error messages to identify issues.  
- Check server logs for detailed error traces.  
- Validate your queries against the schema documentation.  
- To extend queries, add new fields or nested objects as supported by the schema.  
- For custom needs, consider contributing to the TFCE GraphQL schema or opening issues.  

---

## Authentication and HCP/TFE Usage Notes

- The API requires a valid Terraform Cloud/Enterprise API token for authentication.  
- Tokens can be generated in your TFC/E user settings under API tokens.  
- When using Terraform Enterprise (self-hosted), update `TFC_API_URL` accordingly in `.env`.  
- Ensure your token has sufficient permissions to access the resources you query.  
- The GraphQL server handles token injection automatically if configured properly.  

---

## Final Checklist and Resources

- [ ] Installed Node.js, npm, and Docker (optional)  
- [ ] Cloned the TFCE GraphQL repository  
- [ ] Created and configured `.env` with your API token  
- [ ] Started the server locally or via Docker  
- [ ] Explored the schema using the GraphQL playground  
- [ ] Tested basic and advanced queries  
- [ ] Implemented rate limit handling in your client  
- [ ] Consulted documentation for extending or debugging queries  

### Additional Resources

- [Terraform Cloud API Documentation](https://www.terraform.io/cloud-docs/api)  
- [GraphQL Official Website](https://graphql.org/)  
- [GraphQL Playground](https://github.com/graphql/graphql-playground)  
- [TFCE GraphQL GitHub Repository](https://github.com/your-org/tfce-graphql)  

---

Thank you for using TFCE GraphQL! For questions or support, please open an issue on the GitHub repository or contact the maintainers directly.