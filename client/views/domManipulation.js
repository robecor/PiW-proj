const loadingContainer = document.getElementById("loading-container");
const nameInputContainer = document.getElementById("name-input-container");

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
}
