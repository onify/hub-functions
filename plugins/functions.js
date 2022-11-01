'use strict';

const Fs = require('fs');
const Logger = require('../lib/logger.js');

const FUNCTIONS_PATH = './functions';

module.exports = {
  name: 'functions',
  register
};

async function register(server) {
  Fs.readdir(FUNCTIONS_PATH, function (err, files) {
    if (err) {
      Logger.error(`Unable to scan directory: ${err}`);
      process.exit(1);
    }

    files.forEach(function (file) {
      Logger.info(`Register function ${file}`);
      server.register(require(`../${FUNCTIONS_PATH}/${file}`));
    });
  });
}
