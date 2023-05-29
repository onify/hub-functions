'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');

const { afterEach, beforeEach, describe, it } = (exports.lab = Lab.script());
const Helpers = require('../testHelpers');

const FUNCTION_ENDPOINT = '/ldap';

describe('ldap:', () => {
  let server;

  const url = 'ldap%3A%2F%2Fldap.forumsys.com';
  const username = 'cn=read-only-admin,dc=example,dc=com';
  const password = 'password';
  const base = 'dc=example,dc=com';
  const filter = '(objectclass%3D*)';
  const scope = 'sub';
  const tlsOptions = 'rejectUnauthorized%3Dtrue';

  beforeEach(async () => {
    server = await Helpers.getServer();
  });

  afterEach(async () => {
    await server.stop();
  });

  it(`GET ${FUNCTION_ENDPOINT}/search - bad request / missing required query parameter - returns 400`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}/search?username=${username}&password=${password}&base=${base}&filter=${filter}&scope=${scope}`,
    });

    expect(res.statusCode).to.equal(400);
    expect(res.result.message).to.equal('"url" is required');
  });

  it(`GET ${FUNCTION_ENDPOINT}/search - complete query parameters and correct parameter values - returns 200`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}/search?url=${url}&username=${username}&password=${password}&base=${base}&filter=${filter}&scope=${scope}`,
    });

    expect(res.statusCode).to.equal(200);
    expect(res.result.length > 0).to.equal(true);
  });

  it(`GET ${FUNCTION_ENDPOINT}/search - unauthorized / user/password invalid - returns 401`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}/search?url=${url}&username=${username}&password=wrongpassword&base=${base}&filter=${filter}&scope=${scope}`,
    });

    expect(res.statusCode).to.equal(401);
    expect(res.result.error).to.equal('Invalid Credentials');
  });

  it(`GET ${FUNCTION_ENDPOINT}/search - search for a user that does not exist - returns 200`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}/search?url=${url}&username=${username}&password=${password}&base=${base}&filter=(uid%3Dmissinguser)&scope=${scope}&tlsOptions=${tlsOptions}`,
    });

    expect(res.statusCode).to.equal(200);
    expect(res.result).to.equal([]);
  });

  it(`GET ${FUNCTION_ENDPOINT}/search - search for a user that does exist - returns 200`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}/search?url=${url}&username=${username}&password=${password}&base=${base}&filter=(uid%3Dtesla)&scope=${scope}&tlsOptions=${tlsOptions}`,
    });

    expect(res.statusCode).to.equal(200);
    expect(res.result.length).to.equal(1);
  });

  it(`GET ${FUNCTION_ENDPOINT}/search - search result without supplied raw parameter - returns 200`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}/search?url=${url}&username=${username}&password=${password}&base=${base}&filter=${filter}&scope=${scope}`,
    });

    expect(res.statusCode).to.equal(200);
    expect(Object.keys(res.result[0]).includes('messageId')).to.equal(false);
  });

  it(`GET ${FUNCTION_ENDPOINT}/search - search result with supplied raw parameter value true - returns 200`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}/search?url=${url}&username=${username}&password=${password}&base=${base}&filter=${filter}&scope=${scope}&raw=true`,
    });

    expect(res.statusCode).to.equal(200);
    expect(Object.keys(res.result[0]).includes('messageId')).to.equal(true);
  });

  it(`GET ${FUNCTION_ENDPOINT}/search - search result with paged parameter value true - returns 200`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}/search?url=${url}&username=${username}&password=${password}&base=${base}&filter=${filter}&scope=${scope}&paged=true&pageSize=5`,
    });

    expect(res.statusCode).to.equal(200);
    expect(res.result.length === 5).to.equal(true);
  });
});
