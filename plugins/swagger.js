'use strict';

const Swagger = require('hapi-swagger');
const Pack = require('../package');

/* register swagger plugin */
module.exports = {
  name: 'swagger',
  /**
   * @param server
   * @returns {Promise<void>}
   */
  async register(server) {
    const options = {
      info: {
        title: 'Onify Hub Functions',
        description: 'Server side functions for Onify Hub',
        version: Pack.version
      },
      basePath: '/',
      swaggerUI: true,
      sortPaths: 'path-method',
      documentationPath: '/',
      pathPrefixSize: 1
    };

    await server.register([{ plugin: Swagger, options }]);
  }
};
