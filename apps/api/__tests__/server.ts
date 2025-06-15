import { createServer } from 'http';
import { createYoga } from 'graphql-yoga';
import { schema } from '../src/schema';

export function startTestServer() {
  const yoga = createYoga({ schema });
  const server = createServer(yoga);

  return new Promise<{ url: string, close: () => void }>((resolve) => {
    const listener = server.listen(0, () => {
      const port = (listener.address() as any).port;
      resolve({
        url: `http://localhost:${port}/graphql`,
        close: () => server.close(),
      });
    });
  });
}