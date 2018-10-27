const loadingContainer = document.getElementById("loading-container");

class DomManipulator {
  static hideLoader() {
    loadingContainer.classList.add("hidden");
  }

  static showLoader() {
    loadingContainer.classList.remove("hidden");
  }
}
