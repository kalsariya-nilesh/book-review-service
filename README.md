# 📚 Book Review Service

This is a backend microservice built using GraphQL Yoga, TypeScript, Prisma (SQLite), BullMQ, and pnpm workspaces. It allows users to fetch a list of books and submit reviews. Each review is post-processed in a background queue, demonstrating async job handling.

---

## 🚀 Setup Instructions

### 1. Install dependencies

```bash
pnpm install
```

### 2. Setup the database

```bash
pnpm db:generate         # Generate Prisma client
pnpm db:migrate          # Apply schema
pnpm db:seed             # Seed initial book data
```

> Ensure `packages/db/.env` has:  
> `DATABASE_URL="file:./dev.db"`

---

## ▶️ Running the Service

### Local with Docker:

```bash
docker-compose up --build
```

- GraphQL Playground: `http://localhost:4000/graphql`
- Redis runs on port `6379` (for BullMQ)

### Dev mode without Docker:

```bash
pnpm dev:api     # Run GraphQL API locally
pnpm dev:worker  # Run background worker locally
```

---

## 🧪 Run Tests

```bash
pnpm --filter api run test
```

> Uses an isolated in-memory SQLite DB, not `dev.db`.

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
- ✅ Add user ownership to reviews
- ✅ Switch to PostgreSQL or MongoDB for persistence
- ✅ Use Redis for caching or distributed sessions
- ✅ Add pagination and filtering to queries
- ✅ Add logging (e.g., `pino`) and monitoring (e.g., Prometheus + Grafana)

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
