# 📚 Book Review Service

This is a backend microservice built using GraphQL Yoga, TypeScript, Prisma (SQLite), BullMQ, and pnpm workspaces. It allows users to fetch a list of books and submit reviews. Each review is post-processed in a background queue, demonstrating async job handling.


---

## 🚀 Features

- **GraphQL API**: Query and mutate book and review data.
- **Background Processing**: Uses BullMQ and Redis for asynchronous job handling.
- **Monorepo Structure**: Organized with `pnpm` workspaces for scalability.
- **Containerization**: Dockerized for consistent development and deployment environments.
- **Testing**: Includes unit tests using Jest.
- **Lintin/Formatting**: Implemented ESLint and Prettier to maintain consistent code quality and formatting standards.

---

## ⚠️ Prerequisites

Make sure you have the following installed **before** you run the project:

| Tool            | Version       | Install Link                                           |
|---------------- |---------------|--------------------------------------------------------|
| Node.js         | ≥ 20.x        | https://nodejs.org                                     |
| pnpm            | ≥ 8.x         | https://pnpm.io/installation                           |
| Docker + Compose| Latest        | https://docs.docker.com/get-docker/                    |
| Redis           | ≥ 6.x         | https://redis.io/docs/getting-started/installation/    |

To install `pnpm` globally:

```bash
npm install -g pnpm
```

---

## ⚙️ Setup Instructions

### 1. Install dependencies

```bash
pnpm install
```

### 2. Setup the database

> Ensure `packages/db/.env` has:  Add commentMore actions
> `DATABASE_URL="file:./dev.db"`

```bash
pnpm db:generate         # Generate Prisma client
pnpm db:migrate          # Apply schema
pnpm db:seed             # Seed initial book data
```

---

## ▶️ Running the Service


### Dev mode running locally:

```bash
pnpm dev     # Run GraphQL API and background worker locally
```

### Run with Docker:

> ⚠️ **Note:** As we are using **Prisma with SQLite** inside Docker, background jobs (e.g., async workers) may encounter issues due to SQLite’s file-based locking.
> 🔄 Considerd switching to **PostgreSQL** for production-like environments and stable background job processing.


```bash
docker-compose up
```

- GraphQL Playground: `http://localhost:4000/graphql`
- Redis runs on port `6379` (for BullMQ)

---

## 📋 Example Queries

### ✅ Get Books

```graphql
query {
  getBooks {
    id
    title
    author
    reviews {
      content
    }
  }
}
```

### ✅ Add Review

```graphql
mutation {
  addReview(bookId: "YOUR_BOOK_ID", review: { content: "Awesome read" }) {
    id
    reviews {
      content
    }
  }
}
```

---

### 🔨 Build the project

To build the TypeScript code for production

```bash
pnpm build
```

---

## 🧪 Run Tests

```bash
pnpm --filter api run test
```

> Uses an isolated in-memory SQLite DB, not `dev.db`.

---

## 🧹 Clean Workspace

```bash
pnpm clean
```

---

## 🧠 Design Decisions

### Why GraphQL Yoga?

- Lightweight, modern alternative to Apollo
- Built-in Playground and dev experience
- Works great with TypeScript

### Why Prisma + SQLite?

- Prisma gives excellent type-safety and dev ergonomics
- SQLite keeps setup simple and file-based
- Can easily migrate to PostgreSQL with the same code

### Why BullMQ?

- Redis-backed job queue for real async processing
- Decouples API response from background logic

### Why pnpm monorepo?

- Logical separation of `apps` and `packages`
- Easier to scale and maintain over time
- Strict dependency control and faster installs

---

## 🔮 Suggested Future Improvements

- ✅ Add authentication with JWT
- ✅ Implement full CRUD operations for books and reviews.
- ✅ Add user ownership to reviews
- ✅ Switch to PostgreSQL or MongoDB for persistence
- ✅ Use Redis for caching or distributed sessions
- ✅ Implement retry and dead-letter queue (DLQ) handling for background jobs.
- ✅ Add pagination and filtering to queries
- ✅ Add logging (e.g., `pino`) and monitoring (e.g., Prometheus + Grafana)
- ✅ Deploy the service using Kubernetes or serverless platforms.

---

## 🛠️ Troubleshooting

### ❌ Error: `Cannot find module '.prisma/client/default'` or `'"@book-review/db"' has no exported member named 'PrismaClient'`

This usually happens if:

- Prisma client was not generated properly
- The database file is outdated or corrupted

### ✅ Solution:

1. **Delete the local SQLite DB:**

```bash
rm packages/db/prisma/dev.db
```

2. **Re-run database setup:**

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

This will regenerate the Prisma client and seed a fresh database.
