'use strict';

const Joi = require('joi');
const { XMLParser, XMLValidator, XMLBuilder } = require('fast-xml-parser');
const Logger = require('../lib/logger.js');

exports.plugin = {
  name: 'dustin',

  register: async function (server, options) {

    server.route({
      method: 'POST',
      path: '/dustin/order/prepare',
      options: {
        description: 'Prepare Dustin order',
        notes: 'Takes inputs and outputs XML order in Dustin (xcbl) format ',
        tags: ['api', 'dustin'],
        validate: {
        }
      },
      handler: function (request, h) {
        Logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);

      },
    });
  },
};
