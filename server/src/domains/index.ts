import { FastifyInstance } from 'fastify';

import productRoutes from './product';

export const defineRoutes = async (
  fastifyInstance: FastifyInstance
): Promise<void> => {
  fastifyInstance.register(productRoutes, { prefix: '/api/v1/products' });
};
