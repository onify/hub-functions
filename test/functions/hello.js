'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../../lib/server');

/*
exports.apiUrl = function (endpoint, params) {
    const qs = params ? `?${querystring.stringify(params)}` : '';
    return `${settings.get('basePath')}${endpoint}${qs}`;
  };
  */

describe('hello:', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it('GET /api/v1/hello', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/api/v1/hello'
        });
        expect(res.statusCode).to.equal(400);
    });

    it('GET /api/v1/hello?name=world', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/api/v1/hello?name=world'
        });
        expect(res.statusCode).to.equal(200);
    });

    it('GET /api/v1/hello/world', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/api/v1/hello/world'
        });
        expect(res.statusCode).to.equal(200);
    });

    
});