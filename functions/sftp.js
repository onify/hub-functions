'use strict';
const Joi = require('joi');
let Client = require('ssh2-sftp-client');
const logger = require('../lib/logger.js'); 

exports.plugin = {
    name: 'sftp',
    register: async function (server, options) {

        server.route({
            method: 'GET',
            path: '/api/v1/sftp/readfile',
            options: {
              description: 'Read file from STFP server',
              notes: 'Reads file from SFTP server and returns raw content.',
              tags: ['api', 'sftp'],
              validate: {
                  query: Joi.object({
                    filename: Joi.string().required(),
                    host: Joi.string().required(),
                    port: Joi.number().required().default('22').optional(),
                    username: Joi.string().required(),
                    password: Joi.string().required(),
                  })
                }
            },
            handler: async function (request, h) {
              logger.debug(`Request ${(request.method).toUpperCase()} ${request.path}`);
              let sftp = new Client();
              let r = await sftp.connect({ // options
                host: request.query.host,
                port: request.query.port,
                username: request.query.username,
                password: request.query.password
              }).then(() => {
                return sftp.get(request.query.filename); 
              }).then(data => {
                const content = data.toString();
                sftp.end();
                return {
                  response: content,
                  code: 200
                };
              }).catch(err => {
                logger.error(err.message);
                return {
                  response: err.message,
                  code: 500
                };
              });
              return h.response(r.response).code(r.code);
            }
        });    
 
    }
};