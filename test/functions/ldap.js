'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');

const { afterEach, beforeEach, describe, it } = (exports.lab = Lab.script());
const Helpers = require('../testHelpers');

const FUNCTION_ENDPOINT = '/ldap';

describe('ldap:', () => {
  let server;

  beforeEach(async () => {
    server = await Helpers.getServer();
  });

  afterEach(async () => {
    await server.stop();
  });

  it(`GET ${FUNCTION_ENDPOINT}/search - bad request / missing required query parameter - returns 400`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}/search?username=cn%3Dread-only-admin,dc%3Dexample,dc%3Dcom&password=password&base=dc%3Dexample,dc%3Dcom&filter=(objectclass%3D*)&scope=sub`,
    });

    expect(res.statusCode).to.equal(400);
    expect(res.result.message).to.equal('"url" is required');
  });

  it(`GET ${FUNCTION_ENDPOINT}/search - complete query parameters and correct parameter values - returns 200`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}/search?url=ldap%3A%2F%2Fldap.forumsys.com&username=cn%3Dread-only-admin,dc%3Dexample,dc%3Dcom&password=password&base=dc%3Dexample,dc%3Dcom&filter=(objectclass%3D*)&scope=sub`,
    });

    expect(res.statusCode).to.equal(200);
    expect(res.result.length > 0).to.equal(true);
  });

  it(`GET ${FUNCTION_ENDPOINT}/search - unauthorized / user/password invalid - returns 401`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}/search?url=ldap%3A%2F%2Fldap.forumsys.com&username=cn%3Dread-only-admin,dc%3Dexample,dc%3Dcom&password=wrongpassword&base=dc%3Dexample,dc%3Dcom&filter=(objectclass%3D*)&scope=sub`,
    });

    expect(res.statusCode).to.equal(401);
    expect(res.result.error).to.equal('Invalid Credentials');
  });
});
