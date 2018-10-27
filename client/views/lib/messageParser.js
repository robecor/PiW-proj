const Parser = {
  parseJsonMessage (string) {
    let result = null;

    try {
      result = JSON.parse(string);
    } catch (err) {
      console.error(err);
    }

    return result;
  },

  convertJsonMessage(data) {
    let result = "";

    try {
      result = JSON.stringify(data);
    } catch (err) {
      console.error(err);
    }

    return result;
  }
};