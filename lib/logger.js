const pino = require('pino');



const logger = pino({
level: (process.env.NODE_ENV == 'test' ? 'silent' : (process.env.NODE_ENV == 'development' ? 'trace': 'info')),
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      include: 'level,time',
    },
  },
});

module.exports = logger;
