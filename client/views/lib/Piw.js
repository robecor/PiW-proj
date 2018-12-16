class Piw {
  constructor(options) {
    const self = this;
    this.userId = options.userId;
    this.isConnecting = false;
    this.isConnected = false;

    this.peerServerConfig = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302"
        }
      ]
    };

    this.peerConnection = new RTCPeerConnection(this.peerServerConfig);
    this.peerConnection.addEventListener("icecandidate", (event) => {
      if (!event.candidate) {
        self.isConnected = true;
        return;
      }
      console.log(`Generated candidate for ${this.userId}:\n`, event.candidate);
      options.onIceCandidate(event.candidate);
    });
    this.peerConnection.addEventListener("iceconnectionstatechange", options.onIceConnectionStateChange);

    if (options.createOffer) {
      this.dataChannel = this.peerConnection.createDataChannel("dataChannel");
      console.log(this.dataChannel);

      self.dataChannel.onmessage = self.onChannelMessage.bind(self);

      self.peerConnection.createOffer(
        {
          mandatory: {
            'OfferToReceiveAudio': true,
            'OfferToReceiveVideo': true
          },
          'offerToReceiveAudio': true,
          'offerToReceiveVideo': true
        }
      ).then((desc) => {
        self.peerConnection.setLocalDescription(desc);
        console.log(`Created local offer for ${self.userId}:\n`, desc);
        options.onOfferCreation(desc);
      }).catch((err) => {
        console.log(err);
      });
    } else {
      self.peerConnection.ondatachannel = function (event) {
        self.dataChannel = event.channel;

        self.dataChannel.onmessage = self.onChannelMessage.bind(self);
      }
    }

    self.onAnswerCreation = options.onAnswerCreation;
    self.onDataMessage = options.onDataMessage;
  }

  processOffer(desc) {
    console.log(`Processing offer for ${this.userId}:\n`, desc);
    this.peerConnection.setRemoteDescription(desc);
    this.peerConnection.createAnswer(
      {
        mandatory: {
          'OfferToReceiveAudio': true,
          'OfferToReceiveVideo': true
        },
        'offerToReceiveAudio': true,
        'offerToReceiveVideo': true
      }
    ).then((desc) => {
      console.log(`Created answer for ${this.userId}:\n`, desc);
      this.peerConnection.setLocalDescription(desc);
      this.onAnswerCreation(desc);
    }).catch((err) => {
      console.log(err);
    });
  }

  processAnswer(desc) {
    console.log(`Processing answer for ${this.userId}:\n`, desc);
    this.peerConnection.setRemoteDescription(desc);
  }

  processIceCandidate(candidate) {
    console.log(`Processing candidate for ${this.userId}:\n`, candidate);
    const iceCandidate = new RTCIceCandidate(candidate);
    this.peerConnection.addIceCandidate(iceCandidate)
      .then(() => {
        console.log("Success adding candidate");
      }).catch((error) => {
      console.log("Error adding candidate");
    });
  }

  onChannelMessage(event) {
    if (this.onDataMessage) {
      this.onDataMessage(event.data);
    }
  }

  sendChannelMessage(message) {
    if (this.dataChannel) {
      this.dataChannel.send(message);
    }
  }

  closeConnection() {
    this.peerConnection.close();
  }
}