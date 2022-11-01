'use strict';

const Glue = require('@hapi/glue');
const Manifest = require('./manifest');

process.env.NODE_ENV = (process.env.NODE_ENV ? process.env.NODE_ENV : 'development');

module.exports = async function setupApp(options = {}) {
  return Glue.compose(Manifest, options).then(async (s) => {
    await s.initialize();
    return s;
  });
};
