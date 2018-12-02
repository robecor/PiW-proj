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
        const messageObject = jsonParser.parseJsonMessage(message.utf8Data);

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
                data: {
                  users: userConnections.getConnectedUsersWithName(userId)
                }
              }));

              //Notify connected users that someone connected
              userConnections.sendMessageToAllUsers(userId, jsonParser.convertJsonMessage({
                action: "user.connected",
                data: {
                  user: {
                    _id: userId,
                    name: name
                  }
                }
              }));
              break;

            case "user.sdpOffer":
              //Send sdp offer
              userConnections.sendMessageToUser(messageObject.data.userId, jsonParser.convertJsonMessage({
                action: "user.sdpOffer",
                data: {
                  userId: userId,
                  description: messageObject.data.description
                }
              }));
              break;

            case "user.sdpAnswer":
              //Send the sdp answer
              userConnections.sendMessageToUser(messageObject.data.userId, jsonParser.convertJsonMessage({
                action: "user.sdpAnswer",
                data: {
                  userId: userId,
                  description: messageObject.data.description
                }
              }));
              break;

            case "user.iceCandidate":
              //Send ICE candidate
              userConnections.sendMessageToUser(messageObject.data.userId, jsonParser.convertJsonMessage({
                action: "user.iceCandidate",
                data: {
                  userId: userId,
                  candidate: messageObject.data.candidate
                }
              }));
              break;
          }
        }
      }
    });

    connection.on('close', function (connection) {
      userConnections.removeUser(userId);


      //Notify all users that someone has disconnected
      userConnections.sendMessageToAllUsers(userId, jsonParser.convertJsonMessage({
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