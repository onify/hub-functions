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
        server.ext('onPostAuth', (request, h) => {
            if (request.path === '/excel/read') {
                const { schema } = request.payload;
                let parsedSchema = schema ? JSON.parse(schema) : {};

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

                for (const key of Object.keys(parsedSchema)) {
                    const _parsedSchema = parsedSchema[key];

                    if (_parsedSchema.type) {
                        _parsedSchema.type = getParsedType(_parsedSchema.type);
                    }
                }

                request.payload.schema = parsedSchema;
            }

            return h.continue;
        });
        server.route({
            method: 'POST',
            path: '/excel/read',
            options: {
                description: 'Read excel file and return data in JSON-format',
                notes: 'Parse uploaded excel file and return contents in JSON-format. Please see https://www.npmjs.com/package/read-excel-file for more details parser.',
                tags: ['api', 'excel'],
                payload: {
                    multipart: {
                        output: 'file',
                    },
                    allow: 'multipart/form-data',
                    maxBytes: 5242880, // 5mb default limit. Large file may be chunked in a separate hub-function.
                },
                validate: {
                    payload: Joi.object({
                        schema: Joi.object().optional().description('This should be a JSON object, see https://gitlab.com/catamphetamine/read-excel-file#json for more information. Eg. `{"firstname":{"prop":"First name","type":"String"},"lastname":{"prop":"Last name","type":"String"},"email":{"prop":"E-mail","type":"String"}}`'),
                        sheet: Joi.string().optional(),
                        file: Joi.object().required(),
                    }),
                }
            },
            handler: async function (request, h) {
                Logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);
                const { file, sheet } = request.payload;
                let { schema } = request.payload;

                try {
                    if (Object.keys(schema).length === 0) {
                        schema = await readXlsxFile(file.path).then(rows => {
                            const obj = {};

                            for (const key of rows[0]) {
                                obj[key] = {
                                    prop: key,
                                    type: String,
                                }
                            }

                            return obj;
                        });
                    }

                    const options = { schema };

                    if (sheet) {
                        Object.assign(options, { sheet })
                    }

                    const records = await readXlsxFile(file.path, options);
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