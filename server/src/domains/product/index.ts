import { FastifyInstance } from 'fastify';
import { routes } from './api';

const defineRoutes = async (fastifyApp: FastifyInstance): Promise<void> => {
  await routes(fastifyApp);
};

export default defineRoutes;
