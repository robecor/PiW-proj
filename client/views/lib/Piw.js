class Piw {
  constructor(options) {
    const self = this;
    this.userId = options.userId;
    this.videoElement = options.videoElement;
    this.isConnecting = false;
    this.isConnected = false;
    this.fileBuffer = [];
    this.startedCall = false;
    this.offerCreator = !!options.createOffer;
    this.inCall = false;

    this.peerServerConfig = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302"
        }
      ]
    };

    this.peerConnection = new RTCPeerConnection(this.peerServerConfig);

    this.peerConnection.ontrack = this.onNewTrack.bind(this);

    this.peerConnection.addEventListener("icecandidate", (event) => {
      if (!event.candidate) {
        self.isConnected = true;
        return;
      }
      options.onIceCandidate(event.candidate);
    });
    this.peerConnection.addEventListener("iceconnectionstatechange", options.onIceConnectionStateChange);

    if (options.createOffer) {
      this.dataChannel = this.peerConnection.createDataChannel("dataChannel");

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
    self.onDataFile = options.onDataFile;
    self.onCallRequest = options.onCallRequest;
    self.onCallAccepted = options.onCallAccepted;
    self.onOfferCreation = options.onOfferCreation;
    self.onCallEnded = options.onCallEnded;
  }

  processOffer(desc) {
    console.log("Processing offer");
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
      this.peerConnection.setLocalDescription(desc);
      this.onAnswerCreation(desc);
    }).catch((err) => {
    });
  }

  processAnswer(desc) {
    console.log("Processing answer");
    this.peerConnection.setRemoteDescription(desc);
  }

  processIceCandidate(candidate) {
    const iceCandidate = new RTCIceCandidate(candidate);
    this.peerConnection.addIceCandidate(iceCandidate)
      .then(() => {
      }).catch((error) => {
    });
  }

  onChannelMessage(event) {
    const data = event.data;

    if (typeof data === "string") {
      if (data === "__Piw__.buffer.done") {
        this.finishFileMessage();
      } else if (data === "__Piw__.call.request") {
        if (this.inCall) {
          this.refuseCall();
        } else {
          this.onCallRequest();
        }
      } else if (data === "__Piw__.call.refuse") {

      } else if (data === "__Piw__.call.ended") {
        this.closeCall();
        this.onCallEnded();
      } else if (data === "__Piw__.call.accept") {
        this.startMediaAndSend();
        this.onCallAccepted();
        this.startedCall = true;
      } else {
        if (this.onDataMessage) {
          this.onDataMessage(data);
        }
      }
    } else {
      this.fileBuffer.push(data);
    }
  }

  finishFileMessage() {
    const bufferArray = this.fileBuffer;
    let byteLength = 0;
    let currentLength = 0;

    bufferArray.forEach((buffer) => {
      byteLength += buffer.byteLength;
    });

    const uIntArray = new Uint8Array(byteLength);

    bufferArray.forEach((buffer) => {
      uIntArray.set(new Uint8Array(buffer), currentLength);

      currentLength += buffer.byteLength;
    });

    const fileBlob = new Blob([uIntArray]);

    if (this.onDataFile) {
      this.onDataFile(fileBlob);
    }

    this.fileBuffer = [];
  }

  sendChannelMessage(message) {
    if (this.dataChannel) {
      this.dataChannel.send(message);
    }
  }

  sendFile(file) {
    const reader = new FileReader();
    const self = this;

    reader.onload = function () {
      const arrayBuffer = this.result;

      self.dataChannel.send(arrayBuffer);
      self.dataChannel.send("__Piw__.buffer.done");
    };

    reader.readAsArrayBuffer(file);
  }

  closeConnection() {
    this.peerConnection.close();
  }

  requestCall() {
    if (this.dataChannel) {
      this.dataChannel.send("__Piw__.call.request");
    }
  }

  refuseCall() {
    if (this.dataChannel) {
      this.dataChannel.send("__Piw__.call.refuse");
    }
  }

  acceptCall() {
    if (this.dataChannel) {
      this.dataChannel.send("__Piw__.call.accept");
      this.startMediaAndSend();
    }
  }

  startMediaAndSend() {
    const self = this;

    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }).then((localStream) => {
      self.localStream = localStream;

      localStream.getTracks().forEach((track) => {
        self.peerConnection.addTrack(track, localStream);
      });

      self.negotationNeeded();
    }).catch((err) => {
      console.log(err);
    });
  }

  onNewTrack(event) {
    this.remoteStream = event.streams[0];

    if (this.videoElement) {
      this.videoElement.srcObject = this.remoteStream;
    }
  }

  negotationNeeded() {
    const self = this;

    if (this.offerCreator) {
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
        self.peerConnection.setLocalDescription(desc);
        self.onOfferCreation(desc);
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  closeCall() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
      });

      this.localStream = null;

      if (this.videoElement) {
        this.videoElement.srcObject = null;
      }

      if (this.dataChannel) {
        this.dataChannel.send("__Piw__.call.ended");
      }
    }

    this.inCall = false;
  }
}