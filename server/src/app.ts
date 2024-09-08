import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { defineRoutes as domainRoutes } from './domains/index';

const packageJson = {
  version: '1.0.0',
};

const formatUptime = (uptime: number): string => {
  const days = Math.floor(uptime / (24 * 60 * 60));
  const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((uptime % (60 * 60)) / 60);
  const seconds = Math.floor(uptime % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

export const defineRoutes = async (
  fastifyApp: FastifyInstance
): Promise<void> => {
  console.log('Defining routes...');

  await domainRoutes(fastifyApp);

  // health check
  fastifyApp.get(
    '/health',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const healthCheck = {
        uptime: process.uptime(),
        formattedUptime: formatUptime(process.uptime()),
        message: 'OK',
        timestamp: Date.now(),
        version: packageJson.version,
      };
      reply.status(200).send(healthCheck);
    }
  );

  // 404 handler
  fastifyApp.setNotFoundHandler(
    (request: FastifyRequest, reply: FastifyReply) => {
      reply.status(404).send('Not Found');
    }
  );

  console.log('Routes defined');
};
