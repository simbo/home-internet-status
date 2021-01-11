import { ServerOptions } from '@hapi/hapi';

import { env } from '../utils/env';

const { port, host } = env.app;

export const serverOptions: ServerOptions = {
  port,
  host,
  debug: env.isProduction ? false : { log: ['*'], request: ['*'] },
  router: {
    stripTrailingSlash: true
  },
  routes: {}
};
