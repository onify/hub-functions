'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');

const { afterEach, beforeEach, describe, it } = (exports.lab = Lab.script());
const Helpers = require('./testHelpers');

describe('main:', () => {
  let server;

  beforeEach(async () => {
    server = await Helpers.getServer();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('GET /', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/'
    });
    expect(res.statusCode).to.equal(200);
  });
});
