import { db } from '@book-review/db';
import { reviewQueue } from '@book-review/models';
import { GraphQLError } from 'graphql';
import { createSchema } from 'graphql-yoga'

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Book {
      id: ID!
      title: String!
      author: String!
      reviews: [Review!]!
    }

    type Review {
      id: ID!
      content: String!
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
      getBooks: async () => {
        return db.book.findMany({
          include: { reviews: true }
        });
      }
    },
    Mutation: {
      addReview: async (_: any, { bookId, review }: any) => {
  
        const book = await db.book.findUnique({where: { id: bookId }});
  
        if (!book) {
          throw new GraphQLError('Book not found', {
            extensions: {
              code: 'NOT_FOUND',
              http: { status: 404 }
            }
          });
        }
  
        await db.review.create({
          data: {
            content: review.content,
            bookId
          }
        });
  
        await reviewQueue.add('processReview', { bookId });
  
        return db.book.findUnique({
          where: { id: bookId },
          include: { reviews: true }
        });
      },
    },
  },
})
