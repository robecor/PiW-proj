//The websocket connection
const wsConnection = new WebSocket("ws://localhost:3005");
let wsOpen = false;
let selectedUserId = null;
let callingUserId = null;

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
        const existingConnection = peerConnectionHandler.getUserConnection(messageObject.data.userId);

        if (existingConnection) {
          peerConnectionHandler.processUserOffer({
            userId: messageObject.data.userId,
            description: messageObject.data.description
          });
        } else {
          const newConnection = peerConnectionHandler.createNewConnection({
            userId: messageObject.data.userId,
            description: messageObject.data.description,
            createOffer: false,
            videoElement
          });
        }
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

  peerConnectionHandler.onCallRequest = function (userId) {
    if (callingUserId) {
      peerConnectionHandler.refuseCall(userId);
      return;
    }

    callingUserId = userId;
    DomManipulator.showConfirmationModal();
    DomManipulator.showModal();
  };

  peerConnectionHandler.onCallRefused = function (userId) {
    DomManipulator.hideModal();
    DomManipulator.hideUserCalling();

    callingUserId = null;
  };

  peerConnectionHandler.onCallAccepted = function (userId) {
    DomManipulator.hideUserCalling();
    DomManipulator.showVideoModal();
  };

  peerConnectionHandler.onCallEnded = function (userId) {
    callingUserId = null;
    DomManipulator.hideModal();
    DomManipulator.hideVideoModal();
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
    createOffer: true,
    videoElement
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

DomEvents.onVideoStartClick(function () {
  DomManipulator.showUserCalling();
  DomManipulator.showModal();
  peerConnectionHandler.callUser(selectedUserId);
  callingUserId = selectedUserId;
});

DomEvents.onRefuseClick(function () {
  peerConnectionHandler.refuseCall(callingUserId);
  DomManipulator.hideModal();
  DomManipulator.hideConfirmationModal();
  callingUserId = null;
});

DomEvents.onAcceptClick(function () {
  peerConnectionHandler.acceptCall(callingUserId);
  DomManipulator.hideConfirmationModal();
  DomManipulator.showVideoModal();
});

DomEvents.onVideoCloseClick(function () {
  peerConnectionHandler.stopUserCall(callingUserId);
  DomManipulator.hideModal();
  DomManipulator.hideVideoModal();
  callingUserId = null;
});
