
'use strict';
const Joi = require('joi');
const sql = require('mssql');

exports.plugin = {
    name: 'mssql',
    register: async function (server, options) {

        server.route({
            method: 'GET',
            path: '/api/v1/mssql/query',
            options: {
                description: 'Microsoft SQL Server Query',
                notes: 'Query Microsoft SQL Server',
                tags: ['api', 'mssql'], 
                plugins: {
                    'hapi-swagger': {
                      responses: {
                        200: {
                          description: "Success",
                          schema: Joi.object({}).label('json')
                        }
                      }
                    }
                },
                validate: {
                    query: Joi.object({
                      server: Joi.string().required(),
                      query: Joi.string().required(),
                      port: Joi.number().required().default('1433'),
                      encrypt: Joi.boolean().required().default(true),
                      trustServerCertificate: Joi.boolean().required().default(false),
                      database: Joi.string().required(),
                      username: Joi.string().required(),
                      password: Joi.string().required(),
                    })
                  }
              },
            handler: function (request, h) {
                
                const sqlConfig = {
                    user: request.query.username,
                    password: request.query.password,
                    database: request.query.database,
                    server: request.query.server,
                    options: {
                      encrypt: request.query.encrypt, 
                      trustServerCertificate: request.query.trustServerCertificate // change to true for local dev / self-signed certs
                    }
                  }

                  sql.on('error', err => {
                    console.log("Error");
                  })
                
                sql.connect(sqlConfig).then(pool => {
                    return pool.request()
                        .query(request.query.query)
                }).then(result => {
                    //console.dir(result); // !!!!
                    console.dir(result.recordset);
                }).catch(err => {
                    console.log(err); // !!!
                });
                  
                return h.response("OK").code(200);
            }
            
        });    
 
    }
};


/*

async () => {
    try {
     // make sure that any items are correctly URL encoded in the connection string
     await sql.connect(sqlConfig)
     const result = await sql.query`select * from mytable where id = ${value}`
     console.dir(result)
    } catch (err) {
     // ... error checks
    }
   }
   */

