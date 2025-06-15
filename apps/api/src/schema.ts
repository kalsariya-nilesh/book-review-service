import { createSchema } from 'graphql-yoga'
export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      getBooks: String
    }
  `,
  resolvers: {
    Query: {
      getBooks: () => 'My Books!',
    },
  },
})
