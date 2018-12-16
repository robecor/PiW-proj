const userConnections = [];

const peerConnectionHandler = {
  createNewConnection({userId, description, createOffer}) {
    const self = this;
    const existingConnection = this.getUserConnection(userId);

    if (existingConnection) {
      return existingConnection;
    }

    const peerConnection = new Piw({
      userId,
      createOffer,
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

    connection.closeConnection();
    this.removeUserConnection(userId);
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