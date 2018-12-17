const DomEvents = {
  onUserClickCallback: function(){},
  onInputEnterKeyCallback: function(){},

  onUserClick(callback) {
    if (callback && typeof callback === "function") {
      this.onUserClickCallback = callback;
    }
  },

  onInputEnterKey(callback) {
    if (callback && typeof callback === "function") {
      this.onInputEnterKeyCallback = callback;
    }
  }
};

userListBox.addEventListener("click", function (event) {
  const target = event.target;
  const userId = target.getAttribute("data-user-id");

  DomEvents.onUserClickCallback(userId);
});

chatInputForm.addEventListener("submit", function(event) {
    DomEvents.onInputEnterKeyCallback();
});