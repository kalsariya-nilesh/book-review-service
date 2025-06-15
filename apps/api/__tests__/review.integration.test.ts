process.env.DATABASE_URL = 'file:memory:?cache=shared';
import { startTestServer } from './server';
import { db } from '@book-review/db';

describe('Integration: addReview', () => {
  let server: { url: string; close: () => void };
  let bookId: string;

  beforeAll(async () => {
    server = await startTestServer();

    // Create tables if they don't exist (for raw test setup)
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS Book (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL
      );
    `);

    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS Review (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        bookId TEXT NOT NULL,
        FOREIGN KEY (bookId) REFERENCES Book(id)
      );
    `);

    // Seed initial book
    const book = await db.book.create({
      data: {
        title: 'Test Book',
        author: 'Author',
      },
    });

    bookId = book.id;
  });

  afterAll(async () => {
    // Cleanup
    server.close();
    await db.$disconnect();
  });

  test('should add review and return updated book with reviews', async () => {
    const mutation = `
      mutation {
        addReview(bookId: "${bookId}", review: { content: "Awesome read!" }) {
          id
          title
          reviews {
            content
          }
        }
      }
    `;

    const response = await fetch(server.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: mutation }),
    });

    const result = await response.json();

    expect(result.data.addReview.id).toBe(bookId);
    expect(result.data.addReview.reviews).toHaveLength(1);
    expect(result.data.addReview.reviews[0].content).toBe('Awesome read!');
  });
});
