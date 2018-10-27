const WebSocketServer = require('websocket').server;
const userConnections = require("./userConnections.js");
const jsonParser = require("../lib/jsonParser.js");

function startWebsocket(server) {
  const wss = new WebSocketServer({httpServer: server});

  wss.on("request", function (request) {

    //Accept connection and create a user object
    const connection = request.accept(null, request.origin);
    const userId = userConnections.addUser(connection);

    //On incoming user message
    connection.on('message', function (message) {
      if (message.type === 'utf8') {
        //Parse the message string into an object
        const messageObject = jsonParser.parseJsonMessage(message);

        if (messageObject) {
          //Process the message based on the action
          switch (messageObject.action) {
            //Case for when a user wants to set a name
            case "user.setName":
              const name = messageObject.data.name;

              //Don't allow empty names
              if (name && name.trim() === "") {
                console.error("Name can't be an empty string");
                userConnections.sendMessageToUser(userId, jsonParser.convertJsonMessage({
                  action: "system.error",
                  data: {
                    error: "Name can't be an empty string"
                  }
                }));

                break;
              }

              //Set a name for the user
              userConnections.setUserName(userId, name);

              //Send to the connected user a list with all the other users
              userConnections.sendMessageToUser(userId, jsonParser.convertJsonMessage({
                action: "user.list",
                data: userConnections.getConnectedUsersWithName()
              }));
          }
        }
      }
    });

    connection.on('close', function (connection) {
      userConnections.removeUser(userId);


      //Notify all users that someone has disconnected
      userConnections.sendMessageToAllUsers(jsonParser.convertJsonMessage({
        action: "user.disconnected",
        data: {
          userId: userId
        }
      }));
    });
  });
}

module.exports = {
  startWebsocket
};