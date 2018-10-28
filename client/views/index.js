//The websocket connection
const wsConnection = new WebSocket("ws://127.0.0.1:3005");
let wsOpen = false;

//Event for when the connection is open
wsConnection.onopen = function (event) {
  //When open hide the loader and show the name input
  DomManipulator.hideLoader();
  // DomManipulator.showNameUnput();
  DomManipulator.showMainApp();
  wsOpen = true;

  //Event for when we get a message from the server
  wsConnection.onmessage = function (message) {
    const messageObject = Parser.parseJsonMessage(message.data);

    switch (messageObject.action) {
      case "user.list":
        DomManipulator.hideLoader();
        DomManipulator.showMainApp();
        DomManipulator.setUserInBox(messageObject.data.users);
        break;
      case "user.connected":
        DomManipulator.addUserInBox(messageObject.data.user);
        break;
      case "user.disconnected":
        DomManipulator.removeUserFromBox(messageObject.data.userId);
        break;
    }
  }
};

//Function for the name set form
function setUserName() {
  const name = DomManipulator.getNameInputValue();

  //Check if the connection is open
  if (wsOpen) {
    DomManipulator.showLoader();
    DomManipulator.hideNameUnput();
    wsConnection.send(Parser.convertJsonMessage({
      action: "user.setName",
      data: {
        name
      }
    }));
  }
}

DomEvents.onUserClick(function (userId) {
  DomManipulator.selectUserElement(userId);
});