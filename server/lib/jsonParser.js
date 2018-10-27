function convertJsonMessage(data) {
  let result = "";

  try {
    result =JSON.stringify(data);
  } catch (err) {
    console.error(err);
  }

  return result;
}

function parseJsonMessage (string) {
  let result = null;

  try {
    result = JSON.parse(string);
  } catch (err) {
    console.error(err);
  }

  return result;
}

module.exports = {
  convertJsonMessage,
  parseJsonMessage
};