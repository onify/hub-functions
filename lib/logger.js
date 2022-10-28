const pino = require('pino');
const logger = pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      include: 'level,time',
    },
  },
});

module.exports = logger;
