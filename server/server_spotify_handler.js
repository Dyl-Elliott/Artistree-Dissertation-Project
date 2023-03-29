/*
// So, this part of the application is written in node, to be able to export files from this 'module' it has to use the 'module.exports = {}' syntax 
// To have gotten around this feature we could have used 'Express' Where it allows you to use the actual syntax of normal Js file exports and imports syntax. Then 'mjs'. fuiles oculd have been used instead? this would also of had to involve using 'node --experimental-modules' to run .js files - Reason - this could have proven to be problamatic in developement when using different type of file extension matching 
*/

const axios = require("axios"); // using require changes it from a js to a node file??
const t = require("../token/token.js");

module.exports = {
  // passes URL onto spotfiy and attacthes the token -->
  handleRequest: async (req_url) => {
    const token = await t.getToken();

    try {
      const response = await axios({
        url: `http://api.spotify.com/${req_url.slice(9, req_url.length)}`,
        headers: { Authorization: "Bearer " + token },
      });

      return response.data;
    } catch (err) {
      throw Error(err);
    }
  }, // <------- need to add a reject in here
};
