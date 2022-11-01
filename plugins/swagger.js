'use strict';

const swagger = require('hapi-swagger');
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
      basePath: '/api/v1',
      swaggerUI: true,
      sortPaths: 'path-method',
      documentationPath: '/',
      pathPrefixSize: 3
    };

    await server.register([{ plugin: swagger, options }]);
  }
};