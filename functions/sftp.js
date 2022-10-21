'use strict';
const Joi = require('joi');
let Client = require('ssh2-sftp-client');

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
                plugins: {
                  'hapi-swagger': {
                    responses: {
                      200: {
                        description: "Success",
                        schema: Joi.object().label('json')
                      }
                    }
                  }
              },
              validate: {
                  query: Joi.object({
                    filename: Joi.string().required(),
                    host: Joi.string().required(),
                    port: Joi.number().required().default('22'),
                    username: Joi.string().required(),
                    password: Joi.string().required(),
                  })
                }
            },
            handler: function (request, h) {
              let sftp = new Client();
              sftp.connect({ // options
                host: request.query.host,
                port: request.query.port,
                username: request.query.username,
                password: request.query.password
              }).then(() => {
                return sftp.get(request.query.filename); // /Bravida/SE/TEST/Catalogue/Leasing_SE.xml
              }).then(data => {
                let content = data.toString();
                sftp.end();
                console.log(content);
              }).catch(err => {
                console.log(err, 'catch error');
              });

              return h.response({}).code(200);
            }
        });    
 
    }
};