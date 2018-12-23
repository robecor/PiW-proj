const DomEvents = {
  onUserClickCallback: function () {
  },
  onInputEnterKeyCallback: function () {
  },
  onFileUploadCallback: function () {
  },
  onRefuseClickCallback: function () {
  },
  onAcceptClickCallback: function () {
  },
  onVideoCloseClickCallback: function () {
  },
  onVideoStartButtonClickCallback: function () {
  },

  onUserClick(callback) {
    if (callback && typeof callback === "function") {
      this.onUserClickCallback = callback;
    }
  },

  onInputEnterKey(callback) {
    if (callback && typeof callback === "function") {
      this.onInputEnterKeyCallback = callback;
    }
  },

  onFileUpload(callback) {
    if (callback && typeof callback === "function") {
      this.onFileUploadCallback = callback;
    }
  },

  onRefuseClick(callback) {
    if (callback && typeof callback === "function") {
      this.onRefuseClickCallback = callback;
    }
  },

  onAcceptClick(callback) {
    if (callback && typeof callback === "function") {
      this.onAcceptClickCallback = callback;
    }
  },

  onVideoCloseClick(callback) {
    if (callback && typeof callback === "function") {
      this.onVideoCloseClickCallback = callback;
    }
  },

  onVideoStartClick(callback) {
    if (callback && typeof callback === "function") {
      this.onVideoStartButtonClickCallback = callback;
    }
  }
};

userListBox.addEventListener("click", function (event) {
  const target = event.target;
  const userId = target.getAttribute("data-user-id");

  DomEvents.onUserClickCallback(userId);
});

chatInputForm.addEventListener("submit", function (event) {
  DomEvents.onInputEnterKeyCallback();
});

fileInput.addEventListener("change", function (event) {
  const file = fileInput.files[0];

  if (file) {
    DomEvents.onFileUploadCallback(file);
  }
});

refuseButton.addEventListener("click", function (event) {
  DomEvents.onRefuseClickCallback();
});

acceptButton.addEventListener("click", function (event) {
  DomEvents.onAcceptClickCallback();
});

videoCloseButton.addEventListener("click", function (event) {
  DomEvents.onVideoCloseClickCallback();
});

videoStartButton.addEventListener("click", function (event) {
  DomEvents.onVideoStartButtonClickCallback();
});
