'use strict';

const Logger = require('./lib/logger.js');
const SetupApp = require('./lib/setupApp');
const { version } = require('./package.json');

const serverPromise = SetupApp();

module.exports = serverPromise;
module.exports.start = start;

if (require.main === module) {
  start();
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
