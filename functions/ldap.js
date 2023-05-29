'use strict';

const Joi = require('joi');
const LDAP = require('ldapjs');
const Logger = require('../lib/logger.js');
const Qs = require('qs');

/**
 *
 * @type {import('@hapi/hapi').PluginBase}
 */
exports.plugin = {
  name: 'ldap',
  register: async function (server) {
    server.ext('onRequest', (request, h) => {
      let { tlsOptions, attributes } = request.query;

      if (tlsOptions) {
        tlsOptions = Qs.parse(tlsOptions, {
          delimiter: /[;,]/,
        });

        request.query.tlsOptions = tlsOptions;
      }

      if (attributes && !Array.isArray(attributes)) {
        attributes = [attributes];

        request.query.attributes = attributes;
      }

      return h.continue;
    });
    server.route({
      method: 'GET',
      path: '/ldap/search',
      options: {
        description: 'Search LDAP server',
        notes:
          'Performs a search operation against the LDAP server. We are using ldapjs npm here. Check http://ldapjs.org for full docs.',
        tags: ['api', 'ldap'],
        validate: {
          query: Joi.object({
            url: Joi.string()
              .required()
              .description(
                'A valid LDAP URL (proto/host/port), e.g. `ldap://ad.example.com`.'
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
              .description('One of `base`, `one`, or `sub`'),
            attributes: Joi.array()
              .items(Joi.string().required())
              .optional()
              .default(['dn', 'sn', 'cn'])
              .description('Attributes to select and return'),
            raw: Joi.boolean()
              .default(false)
              .description(
                'Either return the raw object (true) or a simplified structure (false)'
              ),
            paged: Joi.boolean()
              .default(false)
              .optional()
              .description('Enable and/or configure automatic result paging'),
            pageSize: Joi.number()
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

        const { url, username, password } = request.query;

        async function setupClient() {
          return new Promise((resolve, reject) => {
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
        }

        const { filter, base, scope, attributes, raw, paged, pageSize } =
          request.query;
        const options = {
          filter,
          scope,
          attributes,
          paged: paged ? { pageSize, pagePause: true } : false,
        };

        try {
          const client = await setupClient();

          function simplify(rows) {
            return rows.reduce((accumulator, value) => {
              const { objectName, attributes } = value;
              let obj = { objectName };

              attributes.forEach((attribute) => {
                const { type, values } = attribute;

                values.forEach((value) => {
                  obj[type] = value;
                });
              });

              accumulator.push(obj);

              return accumulator;
            }, []);
          }

          async function login() {
            return new Promise((resolve, reject) => {
              client.bind(username, password, (error) => {
                if (error) {
                  error.statusCode = 401;
                  reject(error);
                }

                resolve();
              });
            });
          }

          async function search() {
            return new Promise((resolve, reject) => {
              client.search(base, options, (error, result) => {
                let rows = [];

                function normalizedRows() {
                  return !raw ? simplify(rows) : rows;
                }

                result.on('searchEntry', (entry) => {
                  rows.push(entry.pojo);
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

                  resolve(normalizedRows());
                });

                result.on('page', () => {
                  client.unbind((error) => {
                    if (error) {
                      Logger.warn(error.message);
                    }
                  });

                  resolve(normalizedRows());
                });

                if (error) {
                  reject(error);
                }
              });
            });
          }

          await login();
          let result = await search();

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
