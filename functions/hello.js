'use strict';
const Joi = require('joi');

exports.plugin = {
    name: 'hello',
    register: async function (server, options) {

        server.route({
            method: 'GET',
            path: '/api/v1/hello',
            options: {
                description: 'Says hello!',
                notes: 'Say hello to ',
                tags: ['api', 'hello'], 
                validate: {
                    query: Joi.object({
                        name: Joi.string().required().default('world')
                    }).label('hello')
                }
            },
            handler: function (request, h) {
                return h.response(`Hello ${request.query.name}`).code(200);
            }
            
        });    

    }
};
