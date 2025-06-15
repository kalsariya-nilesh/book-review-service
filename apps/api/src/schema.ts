import { books } from '@db/seed';

import { createSchema } from 'graphql-yoga'

type Review = {
  bookId: string;
  review: string;
}

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Book {
      id: ID!
      title: String!
      author: String!
      reviews: [String!]!
    }

    input ReviewInput {
      content: String!
    }

    type Query {
      getBooks: [Book!]!
    }

    type Mutation {
      addReview(bookId: ID!, review: ReviewInput!): Book
    }
  `,
  resolvers: {
    Query: {
      getBooks: () => books,
    },
    Mutation: {
      addReview: async (_: any, { bookId, review }: any) => {
        const book = books.find(b => b.id === bookId);
        if (!book) throw new Error('Book not found');
  
        book.reviews.push(review.content);
        return book;
      },
    },
  },
})
