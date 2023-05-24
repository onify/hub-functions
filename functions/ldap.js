'use strict';

const Joi = require('joi');
const LDAP = require('ldapjs');
const Logger = require('../lib/logger.js');

exports.plugin = {
  name: 'ldap',
  register: async function (server, options) {
    server.route({
      method: 'GET',
      path: '/ldap/search',
      options: {
        description: 'Get users via LDAP',
        notes:
          'Get users from LDAP server based on filter. Based on http://ldapjs.org/filters.html',
        tags: ['api', 'ldap'],
        validate: {
          query: Joi.object({
            url: Joi.string()
              .required()
              .description(
                'LDAP server to connect to, `ldap://ad.example.com`.'
              ),
            username: Joi.string()
              .required()
              .description(
                'An account name capbable of performing the operations desired, e.g. `test@domain.com`'
              ),
            password: Joi.string()
              .required()
              .description('Password for the given username.'),
            tlsOptions: Joi.object({
              rejectUnauthorized: Joi.boolean().required(),
            })
              .optional()
              .description(
                'Additional options passed to TLS connection layer when connecting via ldaps://'
              ),
            base: Joi.string()
              .required()
              .description(
                'The root DN from which all searches will be performed, e.g. `dc=example,dc=com`.'
              ),
            filter: Joi.string()
              .required()
              .description(
                'LDAP filter, e.g. `(&(|(objectClass=user)(objectClass=person))(!(objectClass=computer))(!(objectClass=group)))`'
              ),
            scope: Joi.string()
              .valid('base', 'one', 'sub')
              .default('base')
              .required()
              .description('One of base, one, or sub. Defaults to base.'),
            attributes: Joi.array()
              .items(Joi.string().required())
              .optional()
              .default(['dn', 'sn', 'cn']),
          }),
        },
      },
      handler: async function (request, h) {
        Logger.debug(`Request ${request.method.toUpperCase()} ${request.path}`);

        const { url, username, password } = request.query;

        const setupClient = new Promise((resolve, reject) => {
          const client = LDAP.createClient({
            url,
          });

          const clientErrorListener = (error) => {
            if (client) {
              client.unbind((error) => {
                if (error) {
                  Logger.warn(error.message);
                }
              });
            }

            reject(error);
          };

          client.on('error', clientErrorListener);

          client.on('connect', () => {
            client.removeListener('error', clientErrorListener);
            resolve(client);
          });
        });

        const { filter, base, scope, attributes } = request.query;
        const options = {
          filter,
          scope,
          attributes,
        };

        try {
          const client = await setupClient;

          const login = new Promise((resolve, reject) => {
            client.bind(username, password, (error) => {
              if (error) {
                error.statusCode = 401;
                reject(error);
              }

              resolve();
            });
          });

          const search = new Promise((resolve, reject) => {
            const entries = [];

            client.search(base, options, (error, result) => {
              result.on('searchEntry', (entry) => {
                entries.push(entry.pojo);
              });

              result.on('error', (error) => {
                reject(error);
              });

              result.on('end', () => {
                client.unbind((error) => {
                  if (error) {
                    Logger.warn(error.message);
                  }
                });

                resolve(entries);
              });

              if (error) {
                reject(error);
              }
            });
          });

          await login;
          const result = await search;

          return h.response(result).code(200);
        } catch (error) {
          Logger.error(error.message);
          return h
            .response({ error: error.message })
            .code(error.statusCode ?? 500);
        }
      },
    });
  },
};
