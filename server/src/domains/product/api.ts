import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import { create, search, getById } from './service';
import { Product } from './schema';

const logRequest = () => {
  return (req: FastifyRequest, reply: FastifyReply, done: () => void) => {
    console.log(`${req.method} ${req.url}`);
    done();
  };
};

const model = 'Product';

// CRUD for entity
const routes = (fastify: FastifyInstance): void => {
  console.log(`Setting up routes for ${model}`);

  fastify.get(
    '/',
    { preHandler: logRequest() },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        // TODO: Add pagination and filtering
        const items = await search(req.query as { keyword: string });
        reply.send(items);
      } catch (error) {
        reply.send(error);
      }
    }
  );

  fastify.post(
    '/',
    {
      preHandler: [logRequest()],
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const item = await create(req.body as Product);
        reply.status(201).send(item);
      } catch (error) {
        reply.send(error);
      }
    }
  );

  fastify.get(
    '/:id',
    {
      preHandler: [logRequest()],
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = req.params as { id: string };
        const item = await getById(Number(id));
        if (!item) {
          throw new Error(`${model} not found`);
        }
        reply.status(200).send(item);
      } catch (error) {
        reply.send(error);
      }
    }
  );
};

export { routes };
