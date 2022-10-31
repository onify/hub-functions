'use strict';

require('dotenv').config();
const Hapi = require('@hapi/hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Pack = require('../package');
const Fs = require('fs');
const Logger = require('./logger.js');

const FUNCTIONS_PATH = './functions';
process.env.NODE_ENV = (process.env.NODE_ENV ? process.env.NODE_ENV : 'development');

const server = Hapi.server({
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 8282
});

async function Setup() {
  const swaggerOptions = {
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

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]);

  Fs.readdir(FUNCTIONS_PATH, function (err, files) {
    if (err) {
      Logger.error(`Unable to scan directory: ${err}`);
      process.exit(1);
    }

    files.forEach(function (file) {
      Logger.info(`Register function ${file}`);
      server.register(require(`../${FUNCTIONS_PATH}/${file}`));
    });
  });
}

exports.init = async () => {
  await Setup();
  await server.initialize();
  return server;
};

exports.start = async () => {
  await Setup();
  Logger.info(`Start ${Pack.name}@${Pack.version} (${process.env.NODE_ENV})`);
  await server.start();
  Logger.info(`Server running at: ${server.info.uri}`);
  return server;
};

process.on('unhandledRejection', (err) => {
  Logger.eror(err);
  process.exit(1);
});
