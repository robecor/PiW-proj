const DomEvents = {
  onUserClickCallback: function(){},

  onUserClick(callback) {
    if (callback && typeof callback === "function") {
      this.onUserClickCallback = callback;
    }
  }
};

userListBox.addEventListener("click", function (event) {
  const target = event.target;
  const userId = target.getAttribute("data-user-id");

  DomEvents.onUserClickCallback(userId);
});