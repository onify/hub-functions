'use strict';
const setupApp = require('./lib/setupApp');
const {version} = require('./package.json');

const serverPromise = setupApp();

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
      console.info(`Server ${version} running at: ${server.info.uri}`);
    });
  }).catch((err) => {
    console.error(err.message);
    throw err;
  });
}

async function terminate(signal) {
  process.removeListener('SIGTERM', terminate);
  process.removeListener('SIGINT', terminate);

  try {
    const server = await serverPromise.catch(() => {});
    await server?.stop({timeout: 10000});
  } catch (err) {
    console.error(err, 'Failed to stop server %s: %s', version, err.message);
  }

  process.exit(signal);
}
