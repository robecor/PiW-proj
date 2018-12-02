const loadingContainer = document.getElementById("loading-container");
const nameInputContainer = document.getElementById("name-input-container");
const nameInput = document.getElementById("user-name-input");
const mainAppContainer = document.getElementById("main-app-container");
const userListBox = document.getElementById("user-list-box");
const userChatContainer = document.getElementById("user-chat-container");
const chatWaitingBox = document.getElementById("chat-waiting-container");
const userElements = [];

//Testing purpose
// const userElements = [
//   document.getElementById("el1"),
//   document.getElementById("el2"),
//   document.getElementById("el3"),
//   document.getElementById("el4"),
//   document.getElementById("el5"),
//   document.getElementById("el6"),
// ];

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

  static showMainApp() {
    mainAppContainer.classList.remove("hidden");
  }

  static hideMainApp() {
    mainAppContainer.classList.add("hidden");
  }

  static showWaitingBox() {
    chatWaitingBox.classList.remove("hidden");
  }

  static hideWaitingBox() {
    chatWaitingBox.classList.add("hidden");
  }

  static getNameInputValue() {
    return nameInput.value;
  }

  static addUserInBox(user) {
    const userDiv = document.createElement('div');
    const userListElement = document.createElement('li');
    userListElement.setAttribute("data-user-id", user._id);
    userDiv.classList.add("user-list-div");
    userListElement.classList.add("user-list-element");
    userDiv.textContent = user.name;

    userListElement.appendChild(userDiv);
    userListBox.appendChild(userListElement);
    userElements.push(userListElement);
  }

  static setUserInBox(users) {
    users.forEach((user) => {
      this.addUserInBox(user);
    });
  }

  static removeUserFromBox(userId) {
    const userListElement = userElements.find((element) => {
      const userElementId = element.getAttribute("data-user-id");
      return userId === userElementId
    });

    if (userListElement) {
      userListBox.removeChild(userListElement);
    }
  }

  static selectUserElement(userId) {
    userElements.forEach((userElement) => {
      const userElementId = userElement.getAttribute("data-user-id");

      if (userId === userElementId) {
        userElement.classList.add("selected");
      } else if (userElement.classList.contains("selected")) {
        userElement.classList.remove("selected");
      }
    });

    userChatContainer.scrollIntoView();
  }
}
