const userConnections = [];

const peerConnectionHandler = {
  createNewConnection({userId, description, createOffer, videoElement}) {
    const self = this;
    const existingConnection = this.getUserConnection(userId);

    if (existingConnection) {
      return existingConnection;
    }

    const peerConnection = new Piw({
      userId,
      createOffer,
      videoElement,
      onIceCandidate(candidate) {
        self.onIceCandidate(userId, candidate);
      },
      onIceConnectionStateChange(state) {
        self.onIceConnectionStateChange(userId, state);
      },
      onOfferCreation(desc) {
        self.onSdpOffer(userId, desc);
      },
      onAnswerCreation(desc) {
        self.onSdpAnswer(userId, desc);
      },
      onDataMessage(message) {
        self.onDataMessage(userId, message);
      },
      onDataFile(fileBlob) {
        self.onDataFile(userId, fileBlob);
      },
      onCallRequest() {
        self.onCallRequest(userId);
      },
      onCallAccepted() {
        self.onCallAccepted(userId);
      },
      onCallEnded() {
        self.onCallEnded(userId);
      }
    });

    if (description) {
      peerConnection.processOffer(description);
    }

    userConnections.push(peerConnection);
    return peerConnection;
  },

  processUserOffer({userId, description}) {
    const connection = this.getUserConnection(userId);

    if (connection) {
      connection.processOffer(description);
    }
  },

  processUserAnswer({userId, description}) {
    const connection = this.getUserConnection(userId);

    if (connection) {
      connection.processAnswer(description);
    }
  },

  processUserCandidate({userId, candidate}) {
    const connection = this.getUserConnection(userId);

    if (connection) {
      connection.processIceCandidate(candidate);
    }
  },

  getUserConnection(userId) {
    return userConnections.find(connection => connection.userId === userId);
  },

  userSendMessage(userId, message) {
    const connection = this.getUserConnection(userId);

    if (connection) {
      connection.sendChannelMessage(message);
    }
  },

  userSendFile(userId, file) {
    const connection = this.getUserConnection(userId);

    if (connection) {
      connection.sendFile(file);
    }
  },

  removeUserConnection(userId) {
    let foundIndex = -1;
    userConnections.forEach((connection, index) => {
      if (connection.userId === userId) {
        foundIndex = index;
      }
    });

    userConnections.splice(foundIndex, 1);
  },

  closeUserConnection(userId) {
    const connection = this.getUserConnection(userId);

    if (connection) {
      connection.closeConnection();
    }
    this.removeUserConnection(userId);
  },

  callUser(userId) {
    const connection = this.getUserConnection(userId);

    if (connection) {
      connection.requestCall();
    }
  },

  refuseCall(userId) {
    const connection = this.getUserConnection(userId);

    if (connection) {
      connection.refuseCall();
    }
  },

  acceptCall(userId) {
    const connection = this.getUserConnection(userId);

    if (connection) {
      connection.acceptCall();
    }
  },

  startMediaAndSend(userId) {
    const connection = this.getUserConnection(userId);

    if (connection) {
      connection.startMediaAndSend();
    }
  },

  stopUserCall(userId) {
    const connection = this.getUserConnection(userId);

    if (connection) {
      connection.closeCall();
    }
  },

  onIceCandidate(userId, candidate) {

  },

  onIceConnectionStateChange(userId, state) {

  },

  onSdpOffer(userId, desc) {

  },

  onSdpAnswer(userId, desc) {

  }
};