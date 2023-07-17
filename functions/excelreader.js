'use strict';

const Logger = require('../lib/logger.js');
const readXlsxFile = require('read-excel-file/node');

/**
 * @type {import('@hapi/hapi').PluginBase}
 */
exports.plugin = {
    name: 'excelreader',
    register: function (server) {
        server.route({
            method: 'POST',
            path: '/excel/read',
            options: {
                payload: {
                    output: 'file',
                },
            },
            handler: async function (request, h) {
                Logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);

                try {
                    const schema = {
                        'Förnamn': {
                            prop: 'firstname',
                            type: String
                        },
                        'Efternamn': {
                            prop: 'lastname',
                            type: String
                        },
                        'Epost': {
                            prop: 'email',
                            type: String
                        },
                    }

                    const records = await readXlsxFile(request.payload.path, { schema });

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