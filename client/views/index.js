const wsConnection = new WebSocket("ws://127.0.0.1:3005");
let wsOpen = false;

wsConnection.onopen = function (event) {
  DomManipulator.hideLoader();
  DomManipulator.showNameUnput();
  wsOpen = true;
};

function setUserName() {
  console.log("name");
}