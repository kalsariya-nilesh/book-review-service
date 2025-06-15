import { createYoga } from 'graphql-yoga';
import { createServer } from 'http'
import { schema } from './schema';

const yoga = createYoga({schema});

const server = createServer(yoga)

server.listen(4000, () => {
  console.log('GraphQL Yoga running at http://localhost:4000/graphql')
})