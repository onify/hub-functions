'use strict';

const Hapi = require('@hapi/hapi');
const HapiSwagger = require('hapi-swagger');   
const Inert = require('@hapi/inert'); 
const Vision = require('@hapi/vision');
const Joi = require('joi');
const Pack = require('./package');
const fs = require('fs');
const logger = require('./lib/logger.js'); 

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
            logger.error(`Unable to scan directory: ${err}`);
            process.exit(1);
        } 
        files.forEach(function (file) {
            if (!file.startsWith('_')) { // exclude template files
                server.register(require(`${functionsPath}/${file}`));
                logger.info(`Registered function ${file}`);
            }
        });
    });

    await server.start();
    
    logger.info(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    logger.error(err);
    process.exit(1);
});

init();