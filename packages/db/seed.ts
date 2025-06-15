import { db } from './index';

async function seed() {
  const count = await db.book.count();
  if (count === 0) {
    await db.book.createMany({
      data: [
        { title: 'The White Tiger', author: 'Aravind Adiga' },
        { title: 'Five Point Someone', author: 'Chetan Bhagat' },
        { title: '"The Garden of Evening Mists"', author: 'Tan Twan Eng' },
      ],
    });
    console.log('📚 Seeded books.');
  }
}

seed();
