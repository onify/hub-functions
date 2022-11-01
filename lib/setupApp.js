'use strict';

const Glue = require('@hapi/glue');
const manifest = require('./manifest');

process.env.NODE_ENV = (process.env.NODE_ENV ? process.env.NODE_ENV : 'development');

module.exports = async function setupApp(options = {}) {
  return Glue.compose(manifest, options).then(async (s) => {
    await s.initialize();
    return s;
  });
};
