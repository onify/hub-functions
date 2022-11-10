'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');

const { afterEach, beforeEach, describe, it } = (exports.lab = Lab.script());
const Helpers = require('../testHelpers');

const FUNCTION_ENDPOINT = '/convert';

describe('convert:', () => {
  let server;

  beforeEach(async () => {
    server = await Helpers.getServer();
  });

  afterEach(async () => {
    await server.stop();
  });

  it(`POST ${FUNCTION_ENDPOINT}/xml/json - bad XML content - returns 500`, async () => {
    const res = await server.inject({
      method: 'POST',
      url: `${FUNCTION_ENDPOINT}/xml/json`,
      payload: '<xml>test</xml'
    });
    expect(res.statusCode).to.equal(500);
    expect(res.result.err.code).to.equal('InvalidTag');
  });

  it(`POST ${FUNCTION_ENDPOINT}/xml/json - good XML content - returns 200`, async () => {
    const res = await server.inject({
      method: 'POST',
      url: `${FUNCTION_ENDPOINT}/xml/json`,
      payload: '<xml>test</xml>'
    });
    expect(res.statusCode).to.equal(200);
    expect(res.result).to.equal({ xml: 'test' });
  });

  it(`POST ${FUNCTION_ENDPOINT}/xml/json?ignoreAttributes=false - good XML content - returns 200`, async () => {
    const res = await server.inject({
      method: 'POST',
      url: `${FUNCTION_ENDPOINT}/xml/json?ignoreAttributes=false`,
      payload: '<xml attribute="test">test</xml>'
    });
    expect(res.statusCode).to.equal(200);
    expect(res.result).to.equal({ xml: { '#text': 'test', '@_attribute': 'test' } });
  });

  it(`POST ${FUNCTION_ENDPOINT}/json/xml - bad JSON content - returns 500`, async () => {
    const res = await server.inject({
      method: 'POST',
      url: `${FUNCTION_ENDPOINT}/json/xml`,
      payload: '{ "var1": "value1"'
    });
    expect(res.statusCode).to.equal(500);
    expect(res.result.error).to.equal('Unexpected end of JSON input');
  });

  it(`POST ${FUNCTION_ENDPOINT}/json/xml - good JSON content - returns 200`, async () => {
    const res = await server.inject({
      method: 'POST',
      url: `${FUNCTION_ENDPOINT}/json/xml`,
      payload: '{ "var1": "value1" }'
    });
    expect(res.statusCode).to.equal(200);
    expect(res.result).to.equal('<var1>value1</var1>');
  });

});
