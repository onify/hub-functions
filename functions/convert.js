'use strict';

const Joi = require('joi');
const { XMLParser, XMLValidator, XMLBuilder } = require('fast-xml-parser');
const logger = require('../lib/logger.js');

exports.plugin = {
  name: 'convert',

  register: async function (server, options) {

    server.route({
      method: 'POST',
      path: '/api/v1/convert/xml/json',
      options: {
        description: 'Convert XML content to JSON',
        notes: 'Converts XML content and returns JSON',
        tags: ['api', 'convert'],
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
        const convertOptions = {
          ignoreAttributes: request.query.ignoreAttributes,
        };
        const converter = new XMLParser(convertOptions);
        let jsonObj = converter.parse(request.payload);
        return h.response(jsonObj).code(200);
      },
    });

    server.route({
      method: 'POST',
      path: '/api/v1/convert/json/xml',
      options: {
        description: 'Convert JSON content to XML',
        notes: 'Converts JSON content and returns XML',
        tags: ['api', 'convert'],
        payload: {
          override: 'text/*',
        },
        validate: {
          payload: Joi.string().required().description('JSON content'),
          query: Joi.object({
            ignoreAttributes: Joi.boolean().required().optional().default(true),
          }),
        },
      },
      handler: function (request, h) {
        logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);
        let jsonObj;
        try {
          jsonObj = JSON.parse(request.payload);
        } catch (err) {
          return h.response({ error: err.message }).code(500);
        }
        const convertOptions = {
          ignoreAttributes: request.query.ignoreAttributes,
        };
        const builder = new XMLBuilder(convertOptions);
        let xmlDataStr = builder.build(jsonObj);
        return h.response(xmlDataStr).code(200);
      },
    });
  },
};
