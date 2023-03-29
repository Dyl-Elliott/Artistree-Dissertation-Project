const axios = require("axios");
// const genres = require("../genreJSON/genres"); <-- NOTE> import issues
const t = require("../token/token.js");

const functions = {
  // add: (num1, num2) => num1 + num2,
  // isNull: () => null,

  // // json placeholder website -->
  // fetchUser: () =>
  //   axios
  //     .get("https://jsonplaceholder.typicode.com/users/1")
  //     .then((res) => res.data)
  //     .catch((err) => `${err}: error on API`),

  // testMethod: function () {
  //   axios.get("http://localhost:8000/get_session_token").then((response) => {
  //     session_token_from_local_storage = response.data;
  //   });

  //   return true;
  // },

  /////////////////////////////////////////////////////////////////////////////////////////
  //--------------------------------SCRIPT.js FUNCTIONALITY--------------------------------
  /////////////////////////////////////////////////////////////////////////////////////////
  //
  //
  //
  formatArtistName: function (artist_name) {
    let artist_arr = artist_name.trim().split(" ");

    // NOTE> verification on actual input should be here?
    // if search can not be found (i.e., ";") or search is invalid (i.e., " ")
    for (let i = 0; i < artist_arr.length; i++) {
      artist_arr[i] = artist_arr[i][0].toUpperCase() + artist_arr[i].substr(1);
    }

    // # makes the search go to list items -->
    const artist_name_formatted = artist_arr.join(" ") + "#";

    return artist_name_formatted;
  },

  //
  //
  //
  // getGenresList: function () {
  //   const artist_genre_list = [];
  //   artist.genres.forEach((genre) => {
  //     artist_genre_list.push(genre);
  //   });

  //   return artist_genre_list;
  // },

  /////////////////////////////////////////////////////////////////////////////////////////
  //-------------------------------TESTING API SPOTIFY CALLS-------------------------------
  /////////////////////////////////////////////////////////////////////////////////////////
  //
  //
  //
  getArtist: async (artist_name) => {
    const token = await t.getToken();
    // console.log(`token is: ${token}`);
    const url = "http://localhost:8000/";

    try {
      const result = await axios({
        url: `${url}spotify/v1/search?type=artist&q=${artist_name}&limit=50`,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      return result;
    } catch (err) {
      console.error(`ERROR: ${err} Artist could not be discovered`);
    }
  },

  //
  //
  //
  getRelated: async (artist_id) => {
    const token = await t.getToken();
    // console.log(`token is: ${token}`);
    const url = "http://localhost:8000/";

    try {
      const result = await axios({
        url: `${url}spotify/v1/artists/${artist_id}/related-artists`,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      return result.data;
    } catch (err) {}
  },

  //
  //
  //
  getGenres: async (genre) => {
    const token = await t.getToken();
    // console.log(`token is: ${token}`);
    const url = "http://localhost:8000/";

    try {
      const result = await axios({
        url: `${url}spotify/v1/search?type=artist&q=genre:"${genre}"&limit=50`,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      return result.data;
    } catch (err) {}
  },

  //
  //
  //
  getAuthPerUserLogin: async () => {
    try {
      const client_id = "ec16cb1a604b4204b895d057b9125038";
      const spotify_auth_endpoint = "https://accounts.spotify.com/authorize";
      const redirect_uri = "http://localhost:8000/";

      const space_deliminator = "%20";
      const scopes = [
        "playlist-read-private",
        "playlist-modify-private",
        "playlist-modify-public",
        "user-read-recently-played",
      ];
      const scope_uri_params = scopes.join(space_deliminator);

      const redirect = `${spotify_auth_endpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}
      &scope=${scope_uri_params}&response_type=token&show_dialog=true`;

      // diverts to Spotify log in page -->
      // window.location = redirect;

      return redirect;
    } catch (err) {
      console.error(`ERROR: ${err} Authorization not provided`);
      return "Authorisation failed";
    }
  },

  //
  //
  //
  getUsernameAndSpotifyPlaylist: async () => {
    // FOR TOKEN ACCESS -->
    let logged_in_state = false;
    let session_access_token = "";

    // console.log(`logged_in_state is ${logged_in_state}`);
    await axios.get("http://localhost:8000/get_session_token").then((response) => {
      // console.log(`response is: ${response.data}`);
      logged_in_state = response.data.loggedInState;
    });
    // console.log(`logged_in_state is ${logged_in_state}`);

    if (logged_in_state === "true") {
      await axios.get("http://localhost:8000/get_session_token").then((response) => {
        // console.log(`response is: ${response.data}`);
        session_access_token = response.data.token;
      });
      // console.log(`session_access_token is ${session_access_token.length}`);

      try {
        const result = await axios({
          url: `https://api.spotify.com/v1/me/playlists`,
          method: "GET",
          headers: {
            Authorization: "Bearer " + session_access_token,
          },
        });

        // reset -->
        logged_in_state = false;
        session_access_token = "";

        // console.log(`result is: ${JSON.stringify(result.data)}`);

        return result.data;
      } catch (err) {
        console.log(`ERROR: ${err} Authorization not accepted`);
      }
    }
  },

  //
  //
  //
  createPlaylist: async (username) => {
    // FOR TOKEN ACCESS -->
    let logged_in_state = false;
    let session_access_token = "";

    // console.log(`logged_in_state is ${logged_in_state}`);
    await axios.get("http://localhost:8000/get_session_token").then((response) => {
      // console.log(`response is: ${response.data}`);
      logged_in_state = response.data.loggedInState;
    });
    // console.log(`logged_in_state is ${logged_in_state}`);

    if (logged_in_state === "true") {
      await axios.get("http://localhost:8000/get_session_token").then((response) => {
        // console.log(`response is: ${response.data}`);
        session_access_token = response.data.token;
      });
      // console.log(`session_access_token is ${session_access_token.length}`);

      try {
        await axios({
          url: `https://api.spotify.com/v1/users/${username}/playlists`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + session_access_token,
          },
          data: {
            name: "🎼 Artistree Recommendations Playlist 🎼",
            public: true,
          },
        });

        return "Playlist created";
      } catch (err) {
        console.log(`ERROR: ${err} Username not authorized`);
        return "Playlist has not been created";
      }
    }
  },

  //
  //
  //
  getArtistTopTracks: async (id) => {
    const url = "http://localhost:8000/";

    try {
      const result = await axios({
        url: `${url}spotify/v1/artists/${id}/top-tracks?market=GB`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return result.data;
    } catch (err) {
      console.log(`ERROR: ${err} Username not authorized`);
    }
  },

  //
  //
  //
  addItemToSpotifyPlaylist: async (playlist_id, track_uri) => {
    // FOR TOKEN ACCESS -->
    let logged_in_state = false;
    let session_access_token = "";

    // console.log(`logged_in_state is ${logged_in_state}`);
    await axios.get("http://localhost:8000/get_session_token").then((response) => {
      // console.log(`response is: ${response.data}`);
      logged_in_state = response.data.loggedInState;
    });
    // console.log(`logged_in_state is ${logged_in_state}`);

    if (logged_in_state === "true") {
      await axios.get("http://localhost:8000/get_session_token").then((response) => {
        // console.log(`response is: ${response.data}`);
        session_access_token = response.data.token;
      });
      // console.log(`session_access_token is ${session_access_token.length}`);

      try {
        await axios({
          url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uris=${track_uri}`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + session_access_token,
          },
        });

        return "Track has been added to playlist";
      } catch (err) {
        console.log(`ERROR: ${err} Username not authorized`);

        return "Track has not been added to playlist";
      }
    }
  },
};

module.exports = functions;
