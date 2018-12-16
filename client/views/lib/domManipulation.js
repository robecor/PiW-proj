const loadingContainer = document.getElementById("loading-container");
const nameInputContainer = document.getElementById("name-input-container");
const nameInput = document.getElementById("user-name-input");
const mainAppContainer = document.getElementById("main-app-container");
const userListBox = document.getElementById("user-list-box");
const userChatContainer = document.getElementById("user-chat-container");
const chatWaitingBox = document.getElementById("chat-waiting-container");
const textInput = document.getElementById("text-message-input");
const messageListCont = document.getElementById("user-message-container");
const messageList = document.getElementById("message-list");

const messageListElements = {};
const userElements = [];

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

  static setUsersInBox(users) {
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

  static getInputText() {
    return textInput.value;
  }

  static clearChatInput() {
    textInput.value = "";
  }

  static formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${day}/${month} ${hour}:${minute}`;
  }

  static addMessageToList(message, date, isMe, userId) {
    const listItem = document.createElement("li");
    const listItemMessageDiv = document.createElement("div");
    const listItemDateDiv = document.createElement("div");

    listItem.classList.add("message-list-item");
    listItem.classList.add(`${isMe ? "right" : "left"}`);
    listItemMessageDiv.classList.add("message-item-text");
    listItemDateDiv.classList.add("message-item-date");

    listItemMessageDiv.innerText = message;
    listItemDateDiv.innerText = this.formatDate(date);

    listItemMessageDiv.appendChild(listItemDateDiv);
    listItem.appendChild(listItemMessageDiv);
    messageList.appendChild(listItem);

    if (messageListElements[userId]) {
      messageListElements[userId].push(listItem);
    } else {
      messageListElements[userId] = [listItem];
    }

    messageListCont.scrollTo(0, messageListCont.scrollHeight);
  }

  static clearChatList() {
    while (messageList.firstChild) {
      messageList.removeChild(messageList.firstChild);
    }
  }

  static howUserMessages(userId) {
    const messages = messageListElements[userId] || [];

    messages.forEach((message) => {
      messageList.appendChild(message);
    });
  }
}
