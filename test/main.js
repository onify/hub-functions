'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');

const { afterEach, beforeEach, describe, it } = (exports.lab = Lab.script());
const { init } = require('../lib/server');

describe('main:', () => {
  let server;

  beforeEach(async () => {
    server = await init();
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
