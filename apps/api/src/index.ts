// import { ApolloServer } from '@apollo/server';
// import { startStandaloneServer } from '@apollo/server/standalone';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'http'
import { schema } from './schema';

// const server = new ApolloServer({ typeDefs, resolvers });

// startStandaloneServer(server, { listen: { port: 4000 } })
//   .then(({ url }) => console.log(`🚀 Server ready at ${url}`));

const yoga = createYoga({schema});

const server = createServer(yoga)

server.listen(4000, () => {
  console.log('GraphQL Yoga running at http://localhost:4000/graphql')
})