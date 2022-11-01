'use strict';

process.env.NODE_ENV = 'test';
process.env.TZ = 'Europe/Stockholm';

Error.stackTraceLimit = 20;

const {expect} = require('@hapi/code');

global.expect = expect;

const internals = {
  colors: true,
  timeout: 30000,
  globals: 'Reflect,WebSocket,core,_babelPolyfill,regeneratorRuntime,__core-js_shared__,core,CSS,updateText,create,expect,FinalizationRegistry,WeakRef',
  paths: [
    'test/main.js',
    'test/functions',
  ]
};

module.exports = internals;
