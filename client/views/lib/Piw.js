class Piw {
  constructor(options) {
    this.userId = options.userId;

    this.peerServerConfig = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302"
        }
      ]
    };

    this.peerConnection = new RTCPeerConnection(this.peerServerConfig);
    this.peerConnection.addEventListener("icecandidate", options.onIceCandidate);
    this.peerConnection.addEventListener("iceconnectionstatechange", options.onIceConnectionStateChange);
    this.peerConnection.createOffer((desc) => {
      this.peerConnection.setLocalDescription(desc);
      options.onOfferCreation(desc);
    });

    this.onAnswerCreation = options.onAnswerCreation;
  }

  processAnswer(desc) {
    this.peerConnection.setRemoteDescription(desc);
    this.peerConnection.createAnswer((desc) => {
      this.peerConnection.setLocalDescription(desc);
      this.onAnswerCreation(desc);
    });
  }

  processIceCandidate(candidate) {
    const iceCandidate = new RTCIceCandidate(candidate);
    this.peerConnection.addIceCandidate(iceCandidate)
      .then(() => {
        console.log("Success adding candidate");
      }).catch((error) => {
        console.log("Error adding candidate");
    });
  }
}