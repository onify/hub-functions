'use strict';

const fs = require('fs');
const path = require('path');
const Logger = require('./lib/logger.js');
const SetupApp = require('./lib/setupApp');
const { version } = require('./package.json');

const serverPromise = SetupApp();

const cwd = process.cwd();
const NODE_ENV = process.env.NODE_ENV || 'development';
const CONFIG_BASE_PATH = process.env.CONFIG_BASE_PATH || './config';
const configFileName = `${NODE_ENV}.json`;

let configPath;
if (path.isAbsolute(CONFIG_BASE_PATH)) {
  configPath = path.normalize(CONFIG_BASE_PATH) + path.sep + configFileName;
} else {
  configPath = CONFIG_BASE_PATH + '/' + configFileName;
}

module.exports = serverPromise;
module.exports.start = start;

if (require.main === module) {
  validateConfig();
  start();
}

function validateConfig() {
  try {
    fs.statSync(path.relative(cwd, configPath));
    require(configPath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      const msg = `Could not find configuration file for environment ${NODE_ENV}`;
      console.log('FATAL', msg);
      console.log('FATAL', 'Set NODE_ENV to production or development or add', configPath);
      throw new Error(msg);
    }
    throw new Error(err.message);
  }
}

function start() {
  serverPromise.then((server) => {
    process.once('SIGTERM', terminate);
    process.once('SIGINT', terminate);

    return server.start().then(() => {
      Logger.info(`Server ${version} running at: ${server.info.uri}`);
    });
  }).catch((err) => {
    Logger.error(err.message);
    throw err;
  });
}

async function terminate(signal) {
  process.removeListener('SIGTERM', terminate);
  process.removeListener('SIGINT', terminate);

  try {
    const server = await serverPromise.catch(() => {});
    await server?.stop({ timeout: 10000 });
  } catch (err) {
    Logger.error(err, 'Failed to stop server %s: %s', version, err.message);
  }

  process.exit(signal);
}
