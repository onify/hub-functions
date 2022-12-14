'use strict';

const Joi = require('joi');
const Fs = require('fs');
const Papa = require('papaparse');
const Logger = require('../lib/logger.js');

const unspscCodesFilename = './data/unspsc/data-unspsc-codes.csv';

exports.plugin = {
  name: 'unspsc',
  register: async function (server, options) {
    server.route({
      method: 'POST',
      path: '/unspsc/names',
      options: {
        description: 'Get names by codes',
        notes: 'Get names by UNSPSC® codes',
        tags: ['api', 'unspsc'],
        validate: {
          payload: Joi.array()
            .items(Joi.string())
            .required()
            .description('UNSPSC® codes'),
          query: Joi.object({
            includeMeta: Joi.boolean()
              .default(true)
              .optional()
              .description('Includes Segment, Family, Class'),
            deepSearch: Joi.boolean()
              .default(true)
              .optional()
              .description(
                'Also search for code in Segment, Family, Class. Otherwise only Commodity.'
              ),
          }),
        },
      },
      handler: function (request, h) {
        Logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);
        let csv;
        try {
          csv = Fs.readFileSync(unspscCodesFilename, { encoding: 'utf-8' });
          const csvData = Papa.parse(csv, { header: true }).data;
          let result = {};
          request.payload.forEach((code) => {
            let meta = csvData.filter((data) => data.Commodity === code)[0];
            let name = meta ? meta['Commodity Name'] : null;
            if (request.query.deepSearch) {
              if (!meta) {
                meta = csvData.filter((data) => data.Class === code)[0];
                name = meta ? meta['Class Name'] : null;
              }
              if (!meta) {
                meta = csvData.filter((data) => data.Family === code)[0];
                name = meta ? meta['Family Name'] : null;
              }
              if (!meta) {
                meta = csvData.filter((data) => data.Segment === code)[0];
                name = meta ? meta['Segment Name'] : null;
              }
            }
            result[code] = { name: name };
            if (request.query.includeMeta) {
              result[code].meta = meta;
            }
          });
          return result;
        } catch (err) {
          Logger.error(err.message);
          return h.response({ error: err.message }).code(500);
        }
      },
    });

    server.route({
      method: 'GET',
      path: '/unspsc/{code}',
      options: {
        description: 'Get name by code',
        notes: 'Get name by UNSPSC® code',
        tags: ['api', 'unspsc'],
        validate: {
          params: Joi.object({
            code: Joi.string().description('UNSPSC® code'),
          }),
          query: Joi.object({
            includeMeta: Joi.boolean()
              .default(true)
              .optional()
              .description('Includes Segment, Family, Class'),
            deepSearch: Joi.boolean()
              .default(true)
              .optional()
              .description(
                'Also search for code in Segment, Family, Class. Otherwise only Commodity.'
              ),
          }),
        },
      },
      handler: function (request, h) {
        Logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);
        let csv;
        try {
          csv = Fs.readFileSync(unspscCodesFilename, { encoding: 'utf-8' });
          const csvData = Papa.parse(csv, { header: true }).data;
          const code = request.params.code;
          let meta = csvData.filter((data) => data.Commodity === code)[0];
          let name = meta ? meta['Commodity Name'] : null;
          if (request.query.deepSearch) {
            if (!meta) {
              meta = csvData.filter((data) => data.Class === code)[0];
              name = meta ? meta['Class Name'] : null;
            }
            if (!meta) {
              meta = csvData.filter((data) => data.Family === code)[0];
              name = meta ? meta['Family Name'] : null;
            }
            if (!meta) {
              meta = csvData.filter((data) => data.Segment === code)[0];
              name = meta ? meta['Segment Name'] : null;
            }
          }
          let result = { name: name };
          if (!name) {
            return h.response(result).code(404);  
          }
          if (request.query.includeMeta) {
            result.meta = meta;
          }
          return result;
        } catch (err) {
          Logger.error(err.message);
          return h.response({ error: err.message }).code(500);
        }
      },
    });
  },
};
