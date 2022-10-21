'use strict';
const Joi = require('joi');
const {XMLParser, XMLValidator} = require('fast-xml-parser');

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
                    payload: Joi.object({
                        xml: Joi.string().required()
                    }).label('XMLdata')
                }
            },
            handler: function (request, h) {
                const resultValidator = XMLValidator.validate(request.payload.xml);
                if (resultValidator != true) {
                    return h.response(resultValidator).code(500);
                }
                const parser = new XMLParser();
                let jsonObj = parser.parse(request.payload.xml);
                return h.response(jsonObj).code(200);
            }
            
        });    
 

/*        server.route({
            method: 'POST',
            path: '/api/v1/parseCSV',
            options: {
                description: 'Get todo',
                notes: 'Returns a todo item by the id passed in the path',
                tags: ['api', 'parse'], 
                payload: {
                    maxBytes: 1048576 * 100,
                    output: 'stream',
                    parse: true,
                    timeout: 60000,
                    multipart: true,
                    allow: 'multipart/form-data',
                }
            },
            handler: function (request, h) {
                //console.log(request.payload.somefile); 
                console.log(request.payload.somefile.hapi); 
                console.log(request.payload.somefile._data.toString()); 
                console.log(request.payload.somefile.hapi.headers['content-type']); 
                console.log(request.payload.somefile.hapi.filename); 
                //_encoding

                //console.log(request.payload.image);
                //console.log(request.payload.imageName);
                return h.response(request.payload);
            }
        });    
        */


    }
};
