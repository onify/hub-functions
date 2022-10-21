'use strict';
const Joi = require('joi');

exports.plugin = {
    //pkg: require('./package.json'),
    name: 'func2',
    register: async function (server, options) {

        // Create a route for example

        server.route({
            method: 'POST',
            path: '/api/v1/post',
            options: {
                description: 'Get todo',
                notes: 'Returns a todo item by the id passed in the path',
                tags: ['api'], 
                validate: {
                    payload: Joi.object({
                        post: Joi.string().min(1).max(140),
                        date: Joi.date().required()
                    })
                }
            },
            handler: function (request, h) {
        
                return 'Blog post added';
            }
        });    

        // etc...
        //await someAsyncMethods();
    }
};
