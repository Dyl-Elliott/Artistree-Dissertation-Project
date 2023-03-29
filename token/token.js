// if a user logs in they are given a token which verifies them individually
const axios = require("axios");

module.exports = {
  token: undefined,

  //
  //
  // Generates a serverside specific token which is sent to Spotify
  //  to validate access to services. This is collated from clientID and clientSecret
  //  which is taken from the Spotify dashboard and unique to me as the developer.
  // Then token is returned and used in the webserver as part of an event which is passed
  //  back to Spotify with the formatted url request for API data.
  getToken: async () => {
    const clientId = "ec16cb1a604b4204b895d057b9125038";
    const clientSecret = "5abf41d1c57e418c8b0134e4bd2fb587";

    // ONLY CAPTURES TOKEN ONCE (prevents multiple tokens been provided from Spotify API) -->
    if (this.token === undefined) {
      try {
        const result = await axios({
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
            // grant_type: "client_credentials",
          },
          data: {
            grant_type: "client_credentials",
          },

          url: "https://accounts.spotify.com/api/token",
        });

        const data = await result;
        console.log(data.data.access_token);

        this.token = data.data.access_token;

        return this.token;
      } catch (err) {
        console.error(err);
      }
    } else {
      return this.token;
    }
  },
};
