const userConnections = [];

const peerConnectionHandler = {
  createNewConnection({userId, description}) {
    const existingConnection = this.getUserConnection(userId);

    if (existingConnection) {
      return existingConnection;
    }

    const peerConnection = new Piw({
      userId,
      onIceCandidate(candidate) {
        this.onIceCandidate(userId, candidate);
      },
      onIceConnectionStateChange(state) {
        this.onIceConnectionStateChange(userId, state);
      },
      onOfferCreation(desc) {
        this.onSdpOffer(userId, desc);
      },
      onAnswerCreation(desc) {
        this.onSdpAnswer(userId, desc);
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

  onIceCandidate(userId, candidate) {

  },

  onIceConnectionStateChange(userId, state) {

  },

  onSdpOffer(userId, desc) {

  },

  onSdpAnswer(userId, desc) {

  }
};