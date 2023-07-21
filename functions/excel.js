'use strict';

const Joi = require('joi');
const Logger = require('../lib/logger.js');
const readXlsxFile = require('read-excel-file/node');
const { Integer, Email, URL } = readXlsxFile;

/**
 * @type {import('@hapi/hapi').PluginBase}
 */
exports.plugin = {
    name: 'excel',
    register: function (server) {
        server.ext('onRequest', (request, h) => {
            const query = request.query;

            function getParsedType(type) {
                switch (type) {
                    case 'String':
                        return String;
                    case 'Number':
                        return Number;
                    case 'Boolean':
                        return Boolean;
                    case 'Date':
                        return Date;
                    case 'Integer':
                        return Integer;
                    case 'Email':
                        return Email;
                    case 'URL':
                        return URL;
                    default:
                        return type;
                };
            };

            const parsedSchema = query.schema ? JSON.parse(query.schema) : {};

            for (const key of Object.keys(parsedSchema)) {
                const _parsedSchema = parsedSchema[key];
                _parsedSchema.type = getParsedType(_parsedSchema.type);
            }

            query.schema = parsedSchema;

            return h.continue;
        });
        server.route({
            method: 'POST',
            path: '/excel/read',
            options: {
                payload: {
                    output: 'file',
                    maxBytes: 5242880, // 5mb default limit. Large file may be chunked in a separate hub-function.
                },
                validate: {
                    query: Joi.object({
                        schema: Joi.object(),
                    })
                }
            },
            handler: async function (request, h) {
                Logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);
                const { payload, query } = request;

                try {
                    const records = await readXlsxFile(payload.path, { schema: query.schema });
                    return h.response(records).code(200);
                } catch (error) {
                    const { message } = error;

                    Logger.error(message);
                    return h.response({ error: message }).code(500);
                }
            }
        });
    }
}