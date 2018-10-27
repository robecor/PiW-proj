const loadingContainer = document.getElementById("loading-container");
const nameInputContainer = document.getElementById("name-input-container");
const nameInput = document.getElementById("user-name-input");
const mainAppContainer = document.getElementById("main-app-container");
const userListBox = document.getElementById("user-list-box");
const userDivs = [];

class DomManipulator {
  static hideLoader() {
    loadingContainer.classList.add("hidden");
  }

  static showLoader() {
    loadingContainer.classList.remove("hidden");
  }

  static showNameUnput() {
    nameInputContainer.classList.remove("hidden");
  }

  static hideNameUnput() {
    nameInputContainer.classList.add("hidden");
  }

  static getNameInputValue() {
    return nameInput.value;
  }

  static addUserInBox(user) {
    const userDiv = document.createElement('div');
    userDiv.setAttribute("data-user-id", user._id);
    userDiv.classList.add("user-list-element");
    userDiv.textContent = user.name;

    userListBox.appendChild(userDiv);
    userDivs.push(userDiv);
  }

  static setUserInBox(users) {
    users.forEach((user) => {
      this.addUserInBox(user);
    });
  }

  static removeUserFromBox(userId) {
    const userDiv = userDivs.find((div) => {
      const userDivId = div.getAttribute("data-user-id");
      return userId === userDivId
    });

    if (userDiv) {
      userListBox.removeChild(userDiv);
    }
  }
}
