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
      console.log(1);
      this.dataChannel = this.peerConnection.createDataChannel("dataChannel");
      console.log(this.dataChannel);

      this.dataChannel.onmessage = self.onChannelMessage;

      this.peerConnection.createOffer(
        {
          mandatory: {
            'OfferToReceiveAudio': true,
            'OfferToReceiveVideo': true
          },
          'offerToReceiveAudio': true,
          'offerToReceiveVideo': true
        }
      ).then((desc) => {
        this.peerConnection.setLocalDescription(desc);
        console.log(`Created local offer for ${this.userId}:\n`, desc);
        options.onOfferCreation(desc);
      }).catch((err) => {
        console.log(err);
      });
    } else {
      console.log(2);
      this.peerConnection.ondatachannel = function (event) {
        this.dataChannel = event.channel;
        console.log(this.dataChannel);

        this.dataChannel.onmessage = self.onChannelMessage;
      }
    }

    this.onAnswerCreation = options.onAnswerCreation;
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
    console.log(event.data);
  }

  sendChannelMessage(message) {
    console.log(this.dataChannel);
    if (this.dataChannel) {
      this.dataChannel.send(message);
    }
  }
}