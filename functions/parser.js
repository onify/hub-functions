'use strict';
const Joi = require('joi');
const { XMLParser, XMLValidator } = require('fast-xml-parser');
const logger = require('../lib/logger.js');

exports.plugin = {
  name: 'parser',
  register: async function (server, options) {
    server.route({
      method: 'POST',
      path: '/api/v1/parser/xml',
      options: {
        description: 'Parse XML content to JSON object',
        notes: 'Parses XML content and returns a JSON object',
        tags: ['api', 'parser'],
        payload: {
          override: 'text/*',
        },
        validate: {
          payload: Joi.string().required().description('XML content'),
          query: Joi.object({
            ignoreAttributes: Joi.boolean().required().optional().default(true),
          }),
        },
      },
      handler: function (request, h) {
        logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);
        const resultValidator = XMLValidator.validate(request.payload);
        if (resultValidator != true) {
          return h.response(resultValidator).code(500);
        }
        const parserOptions = {
          ignoreAttributes: request.query.ignoreAttributes,
        };
        const parser = new XMLParser(parserOptions);
        let jsonObj = parser.parse(request.payload);
        return h.response(jsonObj).code(200);
      },
    });
  },
};
