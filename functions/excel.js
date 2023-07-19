'use strict';

const Logger = require('../lib/logger.js');
const readXlsxFile = require('read-excel-file/node');

const DATA_SCHEMA = {
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

/**
 * @type {import('@hapi/hapi').PluginBase}
 */
exports.plugin = {
    name: 'excel',
    register: function (server) {
        server.route({
            method: 'POST',
            path: '/excel/read',
            options: {
                payload: {
                    output: 'file',
                    maxBytes: 1048576, // 1mb default limit. Large file may be chunked in a separate hub-function.
                },
            },
            handler: async function (request, h) {
                Logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);

                try {
                    const records = await readXlsxFile(request.payload.path, { schema: DATA_SCHEMA });
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