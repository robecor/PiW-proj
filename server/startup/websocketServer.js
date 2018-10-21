const WebSocketServer = require('websocket').server;
const userConnections = require("./userConnections.js");

function startWebsocket(server) {
  const wss = new WebSocketServer({httpServer: server});

  wss.on("request", function (request) {
    const connection = request.accept(null, request.origin);
    const userId = userConnections.addUser(connection);

    console.log(userId);

    connection.on('message', function (message) {
      if (message.type === 'utf8') {
        // process WebSocket message
      }
    });

    connection.on('close', function (connection) {
      userConnections.removeUser(userId);
    });
  });
}

module.exports = {
  startWebsocket
};