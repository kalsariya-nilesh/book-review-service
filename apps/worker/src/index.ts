import { Worker } from 'bullmq';
import { db } from '@book-review/db';
import { connection } from '@book-review/models/redis';

new Worker('reviewQueue', async (job) => {
  try {
    const bookId = job.data?.bookId;
    if (!bookId) throw new Error('Missing bookId in job data');

    const book = await db.book.findUnique({
      where: { id: bookId },
      include: { reviews: true },
    });
    if (book && book.reviews.length) {
      const lastReview = book.reviews[book.reviews.length - 1];
      if (!lastReview.content.includes('[Processed by worker]')) {
        await db.review.update({
          where: { id: lastReview.id },
          data: {
            content: `${lastReview.content} [Processed by worker]`,
          },
        });
      }
    }
    console.error(`Worker success for job ${job.id}:`);
    await job.updateProgress(100);
  } catch (err) {
    console.error(`Worker failed on job ${job.id}:`, err);
    throw err; // Can implment jon retry
  } finally {
    await db.$disconnect(); // Always disconnect
  }
}, { connection });

