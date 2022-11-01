'use strict';

require('dotenv').config();
const Pino = require('pino');

const logger = Pino({
  level: (process.env.NODE_ENV === 'test' ? 'silent' : (process.env.NODE_ENV === 'production' ? 'info' : 'trace')),
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      include: 'level,time'
    }
  }
});

module.exports = logger;
