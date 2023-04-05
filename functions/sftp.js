'use strict';
const Joi = require('joi');
let Client = require('ssh2-sftp-client');
const logger = require('../lib/logger.js');

exports.plugin = {
  name: 'sftp',
  register: async function (server, options) {
    
    server.route({
      method: 'GET',
      path: '/sftp/readfile',
      options: {
        description: 'Read file from STFP server',
        notes: 'Reads file from SFTP server and returns raw content.',
        tags: ['api', 'sftp'],
        validate: {
          query: Joi.object({
            filename: Joi.string().required(),
            host: Joi.string().required().description('Hostname or IP of server'),
            port: Joi.number().required().default('22').optional().description('Port number of the server'),
            username: Joi.string().required().description('Username for authentication'),
            password: Joi.string().required().description('Password for password-based user authentication'),
          }),
        },
      },
      handler: async function (request, h) {
        logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);
        let sftp = new Client();
        let r = await sftp
          .connect({
            // options
            host: request.query.host,
            port: request.query.port,
            username: request.query.username,
            password: request.query.password,
          })
          .then(() => {
            return sftp.get(request.query.filename);
          })
          .then((data) => {
            const content = data.toString();
            sftp.end();
            return {
              response: content,
              code: 200,
            };
          })
          .catch((err) => {
            logger.error(err.message);
            return {
              response: err.message,
              code: 500,
            };
          });
        return h.response(r.response).code(r.code);
      },
    });

    server.route({
      method: 'GET',
      path: '/sftp/list',
      options: {
        description: 'List files/folders on STFP server',
        notes: 'List files and folders in selected folder on SFTP server and returns array of files.',
        tags: ['api', 'sftp'],
        validate: {
          query: Joi.object({
            path: Joi.string().required().description('Remote directory path'),
            host: Joi.string().required().description('Hostname or IP of server'),
            port: Joi.number().required().default('22').optional().description('Port number of the server'),
            username: Joi.string().required().description('Username for authentication'),
            password: Joi.string().required().description('Password for password-based user authentication'),
          }),
        },
      },
      handler: async function (request, h) {
        logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);
        let sftp = new Client();
        let r = await sftp
          .connect({
            // options
            host: request.query.host,
            port: request.query.port,
            username: request.query.username,
            password: request.query.password,
          })
          .then(() => {
            return sftp.list(request.query.path);
          })
          .then((data) => {
            sftp.end();
            return {
              response: data,
              code: 200,
            };
          })
          .catch((err) => {
            logger.error(err.message);
            return {
              response: err.message,
              code: 500,
            };
          });
        return h.response(r.response).code(r.code);
      },
    });    

  },
};
