'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');

const { afterEach, beforeEach, describe, it } = (exports.lab = Lab.script());
const Helpers = require('../testHelpers');

const FUNCTION_ENDPOINT = '/api/v1/hello';

describe('hello:', () => {
  let server;

  beforeEach(async () => {
    server = await Helpers.getServer();
  });

  afterEach(async () => {
    await server.stop();
  });

  it(`GET ${FUNCTION_ENDPOINT} - missing "name" query parameter - returns 400`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}`
    });
    expect(res.statusCode).to.equal(400);
    expect(res.result.message).to.equal('"name" is required');
  });

  it(`GET ${FUNCTION_ENDPOINT} - with "name" query parmeter - returns 200`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}?name=world`
    });
    expect(res.statusCode).to.equal(200);
    expect(res.result).to.equal({ hello: 'world' });
  });

  it(`GET ${FUNCTION_ENDPOINT}/{name} - returns 200`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}/world`
    });
    expect(res.statusCode).to.equal(200);
    expect(res.result).to.equal({ hello: 'world' });
  });

  it(`POST ${FUNCTION_ENDPOINT} - returns 201`, async () => {
    const res = await server.inject({
      method: 'POST',
      url: `${FUNCTION_ENDPOINT}`,
      payload: {
        name: 'world'
      }
    });
    expect(res.statusCode).to.equal(201);
    expect(res.result).to.equal({ hello: 'world' });
  });

  it(`PUT ${FUNCTION_ENDPOINT}/{name} - returns 200`, async () => {
    const res = await server.inject({
      method: 'PUT',
      url: `${FUNCTION_ENDPOINT}/world`,
      payload: {
        comment: 'hello'
      }
    });
    expect(res.statusCode).to.equal(200);
    expect(res.result).to.equal({ hello: 'world', comment: 'hello' });
  });

  it(`DELETE ${FUNCTION_ENDPOINT}/{name} - returns 200`, async () => {
    const res = await server.inject({
      method: 'DELETE',
      url: `${FUNCTION_ENDPOINT}/world`
    });
    expect(res.statusCode).to.equal(200);
    expect(res.result).to.equal({ 'bye bye': 'world' });
  });

});
