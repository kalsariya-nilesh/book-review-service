import { Worker } from 'bullmq';
import { db } from '@book-review/db';

new Worker('reviewQueue', async (job) => {
  const book = await db.book.findUnique({
    where: { id: job.data.bookId },
    include: { reviews: true },
  });

  if (book && book.reviews.length) {
    const lastReview = book.reviews[book.reviews.length - 1];
    await db.review.update({
      where: { id: lastReview.id },
      data: {
        content: `${lastReview.content} [Processed by worker]`,
      },
    });
  }
});
