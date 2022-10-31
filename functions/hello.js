'use strict';

const Joi = require('joi');
const Logger = require('../lib/logger.js');

//const API_BASE_PATH = '/api/products';

exports.plugin = {
  name: 'hello',

  register: async function (server, options) {
    server.route({
      method: 'GET',
      path: '/api/v1/hello',
      options: {
        description: 'Says hello!',
        notes: 'Say hello to {name}',
        tags: ['api', 'hello'],
        validate: {
          query: Joi.object({
            name: Joi.string()
              .required()
              .default('world')
              .description('What is your name?'),
          }),
        },
      },
      handler: function (request, h) {
        Logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);
        return h.response({ hello: request.query.name }).code(200);
      },
    });

    server.route({
      method: 'GET',
      path: '/api/v1/hello/{name}',
      options: {
        description: 'Says hello!',
        notes: 'Say hello to {name}',
        tags: ['api', 'hello'],
        validate: {
          params: Joi.object({
            name: Joi.string().description('What is your name?'),
          }),
        },
      },
      handler: function (request, h) {
        Logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);
        return h.response({ hello: request.params.name }).code(200);
      },
    });

    server.route({
      method: 'POST',
      path: '/api/v1/hello',
      options: {
        description: 'Says hello!',
        notes: 'Say hello to {name}',
        tags: ['api', 'hello'],
        validate: {
          payload: Joi.object({
            name: Joi.string().required().description('What is your name?'),
          }),
        },
      },
      handler: function (request, h) {
        Logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);
        return h.response({ hello: request.payload.name }).code(201);
      },
    });

    server.route({
      method: 'PUT',
      path: '/api/v1/hello/{name}',
      options: {
        description: 'Says hello!',
        notes: 'Say hello to {name}',
        tags: ['api', 'hello'],
        validate: {
          params: Joi.object({
            name: Joi.string().description('What is your name?'),
          }),
          payload: Joi.object({
            comment: Joi.string().optional().description('Say something more?'),
          }),
        },
      },
      handler: function (request, h) {
        Logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);
        const result = {
          hello: request.params.name,
          comment: request.payload.comment,
        };
        return h.response(result).code(200);
      },
    });

    server.route({
      method: 'DELETE',
      path: '/api/v1/hello/{name}',
      options: {
        description: 'Says bye bye!',
        notes: 'Say bye bye to {name}',
        tags: ['api', 'hello'],
        validate: {
          params: Joi.object({
            name: Joi.string().description('Say bye bye to?'),
          }),
        },
      },
      handler: function (request, h) {
        Logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);
        const result = {
          'bye bye': request.params.name,
        };
        return h.response(result).code(200);
      },
    });
  },
};
