'use strict';
const Joi = require('joi');
const {XMLParser, XMLValidator} = require('fast-xml-parser');

exports.plugin = {
    name: 'parse',
    register: async function (server, options) {

        server.route({
            method: 'POST',
            path: '/api/v1/parse/xml',
            options: {
                description: 'Get todo',
                notes: 'Returns a todo item by the id passed in the path',
                tags: ['api', 'parse'], 
                validate: {
                    payload: Joi.object({
                        xml: Joi.string().required()
                    })
                }
            },
            handler: function (request, h) {
                const resultValidator = XMLValidator.validate(request.payload.xml);
                if (resultValidator != true) {
                    return h.response(resultValidator).code(500);
                }
                const parser = new XMLParser();
                let jsonObj = parser.parse(request.payload.xml);
                return h.response(JSON.stringify(jsonObj)).code(200);
            }
        });    

    }
};
