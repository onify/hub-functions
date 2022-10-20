'use strict';

const Hapi = require('@hapi/hapi');
const HapiSwagger = require('hapi-swagger');   
const Inert = require('@hapi/inert'); 
const Vision = require('@hapi/vision');
const Joi = require('joi');
const Pack = require('./package');
const fs = require('fs');

const init = async () => {

    const server = Hapi.server({
        port: 5000,
        host: 'localhost'
    });

    const swaggerOptions = {
        info: {
                title: 'Test API Documentation',
                version: Pack.version,
            },
            basePath: "/api/v1",
        };

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);    

    fs.readdir('./plugins', function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            server.register(require(`./plugins/${file}`));
        });
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello World!';
        }
    });

    server.route({
        method: 'POST',
        path: '/post',
        handler: function (request, h) {
    
            return 'Blog post added';
        },
        options: {
            validate: {
                payload: Joi.object({
                    post: Joi.string().min(1).max(140),
                    date: Joi.date().required()
                })
            }
        }
    });    

    server.route({
        method: 'GET',
        path: '/hello/{name}',
        handler: function (request, h) {
    
            return `Hello ${request.params.name}!`;
        },
        options: {
            validate: {
                params: Joi.object({
                    name: Joi.string().min(3).max(10)
                })
            }
        }
    });    

    server.route({
        method: 'GET',
        path:'/hello2/{name}',
        handler: (request, h) => {
    
           return  `Hello ${request.params.name}!`;
        },
        options: {
            validate: {
                headers: Joi.object({
                    cookie: Joi.string().required()
                }),
                options: {
                    allowUnknown: true
                }
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();