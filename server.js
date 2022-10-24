'use strict';

const Hapi = require('@hapi/hapi');
const HapiSwagger = require('hapi-swagger');   
const Inert = require('@hapi/inert'); 
const Vision = require('@hapi/vision');
const Joi = require('joi');
const Pack = require('./package');
const fs = require('fs');

const functionsPath = './functions';

const init = async () => {

    const server = Hapi.server({
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || 8282,
    });

    const swaggerOptions = {
        info: {
                title: 'Onify Hub Functions',
                description: 'Server side functions for Onify Hub',
                version: Pack.version,
            },
            basePath: "/api/v1",
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

    fs.readdir(functionsPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            if (!file.startsWith('_')) { // exclude template files
                console.log(`Register function file ${file}...`);
                server.register(require(`${functionsPath}/${file}`));
            }
        });
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();