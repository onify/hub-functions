'use strict';

const Server = require('../lib/setupApp');

let server;

exports.getServer = async function () {
  if (!server) {
    server = await Server();
  }

  return server;
};
