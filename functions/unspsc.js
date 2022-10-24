'use strict';
const Joi = require('joi');
const fs = require('fs');
const Papa = require('papaparse');
const logger = require('../lib/logger.js'); 

const unspscCodesFilename = './data/unspsc/data-unspsc-codes.csv';

exports.plugin = {
    name: 'unspsc',
    register: async function (server, options) {

        server.route({
            method: 'POST',
            path: '/api/v1/unspsc/names',
            options: {
                description: 'Get names by codes',
                notes: 'Get names by UNSPSC® codes',
                tags: ['api', 'unspsc'], 
                validate: {
                    payload: Joi.array().items(Joi.string()).required().description('UNSPSC® codes'),
                    //payload: Joi.object({
                    //    codes: Joi.array().items(Joi.string().required()).required().description('UNSPSC® codes')
                    //}),
                    query: Joi.object({
                        includeMeta: Joi.boolean().default(true).description('Includes Segment, Family, Class'),
                        deepSearch: Joi.boolean().default(true).description('Also search for code in Segment, Family, Class. Otherwise only Commodity.')
                    })
                }
            },
            handler: function (request, h) {
                logger.debug(`Request ${(request.method).toUpperCase()} ${request.path}`);
                fs.readFile(unspscCodesFilename, 'utf8', (err, csv) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                    const csvData = Papa.parse(csv, {header:true}).data
                    let result = {};
                    request.payload.forEach(code => {
                        let meta = csvData.filter(data => data.Commodity === code)[0]; 
                        let name = (meta ? meta['Commodity Name'] : null);
                        if (request.query.deepSearch) {
                            if (!meta) {
                                meta = csvData.filter(data => data.Class === code)[0]; 
                                name = (meta ? meta['Class Name'] : null);    
                            } 
                            if (!meta) {
                                meta = csvData.filter(data => data.Family === code)[0]; 
                                name = (meta ? meta['Family Name'] : null);    
                            }
                            if (!meta) {
                                meta = csvData.filter(data => data.Segment === code)[0];
                                name = (meta ? meta['Segment Name'] : null);         
                            }
                        }
                        result[code] = {name: name};
                        if (request.query.includeMeta) {
                            result[code].meta = meta;
                        }
                    });
                    console.log(result); 
                });  


                return h.response("OK").code(200); // !!!!
            }
        });    

        server.route({
            method: 'GET',
            path: '/api/v1/unspsc/{code}',
            options: {
                description: 'Get name by code',
                notes: 'Get name by UNSPSC® code',
                tags: ['api', 'unspsc'], 
                validate: {
                    params: Joi.object({
                        code: Joi.string().description('UNSPSC® code')
                    }),
                    query: Joi.object({
                        includeMeta: Joi.boolean().default(true).description('Includes Segment, Family, Class'),
                        deepSearch: Joi.boolean().default(true).description('Also search for code in Segment, Family, Class. Otherwise only Commodity.')
                    })
                }
            },
            handler: function (request, h) {
                logger.debug(`Request ${(request.method).toUpperCase()} ${request.path}`);
                fs.readFile(unspscCodesFilename, 'utf8', (err, csv) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                    const csvData = Papa.parse(csv, {header:true}).data;
                    const code = request.params.code;
                    let meta = csvData.filter(data => data.Commodity === code)[0]; 
                    let name = (meta ? meta['Commodity Name'] : null);
                    if (request.query.deepSearch) {
                        if (!meta) {
                            meta = csvData.filter(data => data.Class === code)[0]; 
                            name = (meta ? meta['Class Name'] : null);    
                        } 
                        if (!meta) {
                            meta = csvData.filter(data => data.Family === code)[0]; 
                            name = (meta ? meta['Family Name'] : null);    
                        }
                        if (!meta) {
                            meta = csvData.filter(data => data.Segment === code)[0];
                            name = (meta ? meta['Segment Name'] : null);         
                        }
                    }
                    let result = {name: name};
                    if (request.query.includeMeta) {
                        result.meta = meta;
                    }

                    console.log(result); 
                });  


                return h.response("OK").code(200); // !!!!
            }
        });    


    }
};
