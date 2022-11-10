'use strict';
const Joi = require('joi');
const sql = require('mssql');
const logger = require('../lib/logger.js');

exports.plugin = {
  name: 'mssql',
  register: async function (server, options) {
    server.route({
      method: 'GET',
      path: '/mssql/query',
      options: {
        description: 'Microsoft SQL Server Query',
        notes: 'Query Microsoft SQL Server',
        tags: ['api', 'mssql'],
        validate: {
          query: Joi.object({
            server: Joi.string().required(),
            query: Joi.string().required(),
            port: Joi.number().required().default('1433').optional(),
            encrypt: Joi.boolean().required().default(false).optional(),
            trustServerCertificate: Joi.boolean()
              .required()
              .default(false)
              .optional(),
            database: Joi.string().required(),
            username: Joi.string().required(),
            password: Joi.string().required(),
          }),
        },
      },
      handler: async function (request, h) {
        logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);
        const sqlConfig = {
          user: request.query.username,
          password: request.query.password,
          database: request.query.database,
          server: request.query.server,
          options: {
            encrypt: request.query.encrypt,
            trustServerCertificate: request.query.trustServerCertificate,
          },
        };
        let r = await sql
          .connect(sqlConfig)
          .then((pool) => {
            return pool.request().query(request.query.query);
          })
          .then((result) => {
            return {
              response: result.recordset,
              code: 200,
            };
          })
          .catch((err) => {
            logger.error(err.message);
            return {
              response: {
                error: err.message,
              },
              code: 500,
            };
          });
        return h.response(r.response).code(r.code);
      },
    });
  },
};
