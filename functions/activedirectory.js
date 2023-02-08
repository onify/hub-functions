'use strict';

const Joi = require('joi');
const ActiveDirectory = require('../node_modules/activedirectory2');
const Logger = require('./lib/logger.js');

exports.plugin = {
  name: 'activedirectory',

  register: async function (server, options) {
    server.route({
      method: 'GET',
      path: '/activedirectory/users',
      options: {
        description: 'Get users from Active Directory',
        notes:
          'Get all users from Active Directory based on filter. Based on https://github.com/jsumners/node-activedirectory.',
        tags: ['api', 'activedirectory'],
        validate: {
          query: Joi.object({
            url: Joi.string()
              .required()
              .description(
                'Active Directory server to connect to, e.g. `ldap://ad.example.com`.'
              ),
            username: Joi.string()
              .required()
              .description(
                'An account name capbable of performing the operations desired.'
              ),
            password: Joi.string()
              .required()
              .description('Password for the given username.'),
            filter: Joi.string()
              .required()
              .description(
                'LDAP filter, e.g. `(&(|(objectClass=user)(objectClass=person))(!(objectClass=computer))(!(objectClass=group)))`'
              ),
            baseDN: Joi.string()
              .required()
              .description(
                'The root DN from which all searches will be performed, e.g. `dc=example,dc=com`.'
              ),
            scope: Joi.string()
              .valid('base', 'one', 'sub')
              .default('base')
              .optional()
              .description('One of base, one, or sub. Defaults to base.'),
            attributes: Joi.array()
              .items(Joi.string().required())
              .optional()
              .default([
                'objectGUID',
                'uSNChanged',
                'manager',
                'mail',
                'displayName',
                'givenName',
                'sn',
                'company',
                'department',
                'telephoneNumber',
                'mobile',
                'title',
                'distinguishedName',
                'sAMAccountName',
                'description',
                'cn',
                'employeeID',
                'userPrincipalName',
              ]),
            paged: Joi.boolean()
              .default(false)
              .optional()
              .description('Enable and/or configure automatic result paging'),
            startFrom: Joi.number()
              .integer()
              .default(0)
              .optional()
              .description(
                'Offset for pagination. When not provided, this method returns the first page only, which means startFrom = 0.'
              ),
            sizeLimit: Joi.number()
              .integer()
              .default(200)
              .max(10000)
              .optional()
              .description(
                'The maximum number of entries to return. Max 10000 entries.'
              ),
          }),
        },
      },
      handler: async function (request, h) {
        Logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);

        var config = {
          url: request.query.url,
          username: request.query.username,
          password: request.query.password,
        };
        var ad = new ActiveDirectory(config);

        var opts = {
          filter: request.query.filter,
          baseDN: request.query.baseDN,
          scope: request.query.scope,
          paged: request.query.paged,
          sizeLimit: request.query.sizeLimit,
          attributes: request.query.attributes,
        };

        try {
          const users = await new Promise((resolve, reject) => {
            ad.findUsers(opts, function (err, users) { // Need to make async
              if (err) {
                //return h.response({ error: err.message }).code(500);
                return reject(err)
              }
              return resolve(users);
            });
          });
         
          if (!users || users.length == 0) {
            return h.response([]).code(404);
          }
        
          return h.response(users.slice(request.query.startFrom, request.query.sizeLimit).length).code(200);
        } catch (error) {
          return h.response({ error: error.message }).code(500);
        }

        /*
        ad.findUsers(opts, function (err, users) { // Need to make async
          if (err) {
            return h.response({ error: err.message }).code(500);
          }
          if (!users || users.length == 0) {
            return h.response([]).code(404);
          }
          return h.response(users.slice(request.query.startFrom, request.query.sizeLimit).length).code(200);
        });*/

        //Logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);
        //return h.response(ad).code(200);
      },
    });
  },
};
