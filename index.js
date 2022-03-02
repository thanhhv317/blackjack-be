'use strict';

const bootstrap = require('./lib/infrastructure/config/bootstrap');
const httpServer = require('./lib/infrastructure/webserver/server');

// Start the server
const start = async () => {

  try {
    await bootstrap.init();

    const port = process.env.PORT || '3333';

    httpServer.listen(port, () => {
      console.log("WS running on port " + port);
    })

  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();