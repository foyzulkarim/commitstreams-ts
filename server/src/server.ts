import fastify, { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import { AddressInfo } from 'net';

import { defineRoutes } from './app';
import { AppDataSource } from './libraries/db';

const createFastifyApp = async (): Promise<FastifyInstance> => {
  const fastifyApp: FastifyInstance = fastify({ logger: true });
  fastifyApp.register(helmet);
  fastifyApp.register(require('@fastify/formbody'));
  fastifyApp.register(cookie);
  fastifyApp.register(cors, {
    origin: 'http://localhost:3000',
    credentials: true,
  });

  await defineRoutes(fastifyApp);

  // Add the /api/ping route
  fastifyApp.get('/api/ping', (request, reply) => {
    return 'pong';
  });

  fastifyApp.addHook('onRequest', (request, reply, done) => {
    console.log(`${request.method} ${request.url}`);
    done();
  });

  console.log('Fastify middlewares are set up');
  return fastifyApp;
};

const openConnection = (
  fastifyApp: FastifyInstance
): Promise<{ address: string; port: number }> => {
  return new Promise((resolve) => {
    const webServerPort = 4000;
    console.log(`Server is about to listen to port ${webServerPort}`);
    fastifyApp.listen({ port: webServerPort }, (err, address) => {
      if (err) {
        throw err;
      } else {
        const serverAddress = fastifyApp.server.address() as AddressInfo;
        resolve({ address: serverAddress.address, port: serverAddress.port });
      }
    });
  });
};

export const startWebServer = async (): Promise<FastifyInstance> => {
  console.log('Starting web server...');
  const fastifyApp = await createFastifyApp();
  const APIAddress = await openConnection(fastifyApp);
  await AppDataSource.initialize();
  console.log(`Server is running on ${APIAddress.address}:${APIAddress.port}`);
  return fastifyApp;
};
