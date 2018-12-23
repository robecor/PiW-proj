//The websocket connection
const wsConnection = new WebSocket("ws://127.0.0.1:3005");
let wsOpen = false;
let selectedUserId = null;

//Event for when the connection is open
wsConnection.onopen = function (event) {
  //When the connection is open hide the loader and show the name input
  DomManipulator.hideLoader();
  DomManipulator.showNameUnput();
  // DomManipulator.showMainApp();
  wsOpen = true;

  //Event for when we get a message from the server
  wsConnection.onmessage = function (message) {
    const messageObject = Parser.parseJsonMessage(message.data);

    switch (messageObject.action) {
      case "user.list":
        DomManipulator.hideLoader();
        DomManipulator.showMainApp();
        DomManipulator.setUsersInBox(messageObject.data.users);
        break;
      case "user.connected":
        DomManipulator.addUserInBox(messageObject.data.user);
        break;
      case "user.disconnected":
        DomManipulator.removeUserFromBox(messageObject.data.userId);
        peerConnectionHandler.closeUserConnection(messageObject.data.userId);
        DomManipulator.deleteUserMessages(messageObject.data.userId);
        DomManipulator.showWaitingBox();
        break;
      case "user.sdpOffer":
        const newConnection = peerConnectionHandler.createNewConnection({
          userId: messageObject.data.userId,
          description: messageObject.data.description,
          createOffer: false
        });
        break;
      case "user.sdpAnswer":
        peerConnectionHandler.processUserAnswer({
          userId: messageObject.data.userId,
          description: messageObject.data.description
        });
        break;
      case "user.iceCandidate":
        peerConnectionHandler.processUserCandidate({
          userId: messageObject.data.userId,
          candidate: messageObject.data.candidate
        });
        break;
    }
  };

  peerConnectionHandler.onIceCandidate = function (userId, candidate) {
    wsConnection.send(Parser.convertJsonMessage({
      action: "user.iceCandidate",
      data: {
        userId,
        candidate
      }
    }));
  };

  peerConnectionHandler.onSdpOffer = function (userId, description) {
    wsConnection.send(Parser.convertJsonMessage({
      action: "user.sdpOffer",
      data: {
        userId,
        description
      }
    }));
  };

  peerConnectionHandler.onSdpAnswer = function (userId, description) {
    wsConnection.send(Parser.convertJsonMessage({
      action: "user.sdpAnswer",
      data: {
        userId,
        description
      }
    }));
  };

  peerConnectionHandler.onDataMessage = function (userId, message) {
    const isSelectedUser = selectedUserId === userId;

    DomManipulator.addMessageToList(message, new Date(), false, userId, isSelectedUser);

    if (!isSelectedUser) {
      DomManipulator.showUserUnread(userId);
    }
  };

  peerConnectionHandler.onDataFile = function (userId, fileBlob) {
    const isSelectedUser = selectedUserId === userId;

    DomManipulator.addFileToChat(fileBlob, new Date(), false, userId, isSelectedUser);

    if (!isSelectedUser) {
      DomManipulator.showUserUnread(userId);
    }
  };
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
  DomManipulator.hideWaitingBox();

  const newConnection = peerConnectionHandler.createNewConnection({
    userId: userId,
    createOffer: true
  });

  if (selectedUserId !== userId) {
    DomManipulator.clearChatList();
    DomManipulator.showUserMessages(userId);
    DomManipulator.hideUserUnread(userId);
  }

  selectedUserId = userId;
});

DomEvents.onInputEnterKey(function () {
  const text = DomManipulator.getInputText();
  peerConnectionHandler.userSendMessage(selectedUserId, text);
  DomManipulator.clearChatInput();
  DomManipulator.addMessageToList(text, new Date(), true, selectedUserId, true);
});

DomEvents.onFileUpload(function (file) {
  peerConnectionHandler.userSendFile(selectedUserId, file);
  DomManipulator.clearFileField();
  DomManipulator.addFileToChat(file, new Date(), true, selectedUserId, true);
});

DomEvents.onRefuseClick(function () {

});

DomEvents.onAcceptClick(function () {

});

DomEvents.onVideoCloseClick(function () {

});
