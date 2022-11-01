'use strict';

const manifest = {
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 8282,
    routes: {
      cors: true,
      validate: {
        failAction: async (request, h, err) => {
          throw err;
        }
      }
    }
  },
  register: {
    options: {
      once: true,
    },
    plugins: [
      {
        plugin: require('@hapi/inert')
      },
      {
        plugin: require('@hapi/vision')
      },
      {
        plugin: require('../plugins/functions')
      },
      {
        plugin: require('../plugins/swagger')
      },
    ]
  }
};

module.exports = manifest;
