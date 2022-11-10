'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');

const { afterEach, beforeEach, describe, it } = (exports.lab = Lab.script());
const Helpers = require('../testHelpers');

const FUNCTION_ENDPOINT = '/unspsc';

describe('unspsc:', () => {
  let server;

  beforeEach(async () => {
    server = await Helpers.getServer();
  });

  afterEach(async () => {
    await server.stop();
  });

  it(`GET ${FUNCTION_ENDPOINT}/9999 - code does not exist - returns 404`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}/9999`
    });
    expect(res.statusCode).to.equal(404);
    expect(res.result).to.equal({ name: null });
  });

  it(`GET ${FUNCTION_ENDPOINT}/60104601 - code does exist - returns 200`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}/60104601`
    });
    expect(res.statusCode).to.equal(200);
    expect(res.result).to.equal({
      name: 'Force tables',
      meta: {
        Segment: '60000000',
        'Segment Name': 'Musical Instruments and Games and Toys and Arts and Crafts and Educational Equipment and Materials and Accessories and Supplies',
        Family: '60100000',
        'Family Name': 'Developmental and professional teaching aids and materials and accessories and supplies',
        Class: '60104600',
        'Class Name': 'Mechanical physics materials',
        Commodity: '60104601',
        'Commodity Name': 'Force tables'
      }
    });
  });

  it(`GET ${FUNCTION_ENDPOINT}/60104601?includeMeta=false - returns 200`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}/60104601?includeMeta=false`
    });
    expect(res.statusCode).to.equal(200);
    expect(res.result).to.equal({ name: 'Force tables' });
  });

  it(`GET ${FUNCTION_ENDPOINT}/60104600?includeMeta=false&deepSearch=true - find in deep search - returns 200`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}/60104600?includeMeta=false&deepSearch=true`
    });
    expect(res.statusCode).to.equal(200);
    expect(res.result).to.equal({ name: 'Mechanical physics materials' });
  });

  it(`GET ${FUNCTION_ENDPOINT}/60104600?includeMeta=false&deepSearch=false - not found because deep search is disabled - returns 404`, async () => {
    const res = await server.inject({
      method: 'GET',
      url: `${FUNCTION_ENDPOINT}/60104600?includeMeta=false&deepSearch=false`
    });
    expect(res.statusCode).to.equal(404);
    expect(res.result).to.equal({ name: null });
  });

});
