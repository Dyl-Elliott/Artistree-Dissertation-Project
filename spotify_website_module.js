// NOTE> could convert fetch() requests to axios() for consistency -->
// import axios from "axios";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//                                HOME PAGE                                   //
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// MY IP ADDRESS (for port forwarding) = 212.50.179.50

//
//
//
// Used to remove returned data from user login in URL bar (from # symbol).
const resetURLAddress = function () {
  const urlObj = new URL(window.location.href);
  urlObj.search = "";
  urlObj.hash = "";
  const url = urlObj.toString();
  // console.log(url); // e.g = https://localhost:8000/

  return url;
};

//
//
//
// Search by artist name -->
// https://developer.spotify.com/console/get-search-item/
//
//
// Collects artist information from search criteria on first instance.
// If the artist can be found it ... NOTE> SHOULD THIS SAVE TO SOMEWHERE LIKE LOCAL STORAGE?
// If the artist cannot be found it passes to listEntries() to provide information
//  to the user on additional selection options in a list format.
const getArtist = async (artist_name) => {
  // NOTE> window.location.origin COULD BE USED HERE instead of resetURLAddress() -->
  const url = resetURLAddress();

  //---------------------------------------IMPORTANT NOTE> DON NOT DELETE -->
  //----------------------------------NOTE> using fetch() -->
  // try {
  //   const result = await fetch(
  //     // NOTE> HREF WOULD NEED TO CHANGE IF HOSTED
  //     `${url}spotify/v1/search?type=artist&q=${artist_name}&limit=50`, // only accepts v1 onwards
  //     {
  //       method: "GET",
  //       // This gets provided in the Handler function -->
  //       // headers: { Authorization: "Bearer " + token },
  //     }
  //   );

  //   const data = await result.json();
  //   console.log(`data is: ${data}`);

  //   return data;
  // } catch (err) {
  //   alert("Something went wrong.. Please reload the page and try again.");
  //   console.error(`ERROR: ${err} Artist could not be discovered`);
  // }
  //---------------------------------------------------------

  //----------------------------------NOTE> using axios() -->
  try {
    const result = await axios({
      url: `${url}spotify/v1/search?type=artist&q=${artist_name}&limit=50`,
      method: "GET",
      // headers: {
      //   Accept: "application/json",
      //   "Content-Type": "application/json",
      //   Authorization:
      //     "Bearer " +
      //     "BQCDvdPJ9l8CYpWUmsgp4Wtxw-Jrce-ztovWlO_n9mDYFy8iqSR3RKAcBPGe5ELjpQMx1-eKGgf4TLC2qBmHJNzmF2pJSL7csst_T-3xXyBHIEB2TFRe",
      // },
    });
    console.log(`result is: ${result}`);
    // const data = result.json();
    // console.log(`data is: ${data}`);
    return result.data;
  } catch (err) {}
};

//
//
//
// Get Artist's Related Artists -->
// https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artists-related-artists
//
const getRelated = async (currently_selected_items) => {
  console.log(currently_selected_items);
  const url = resetURLAddress();

  //----------------------------------NOTE> using fetch() -->
  // try {
  //   // https://api.spotify.com/v1/artists/60sHltql8nSpjm0aTKQcqX/related-artists
  //   // NOTE> object or arrays of objects.....
  //   const result = await fetch(`${url}spotify/v1/artists/${currently_selected_items.id}/related-artists`, {
  //     method: "GET",
  //   });

  //   const data = await result.json();

  //   return data;
  // } catch (err) {
  //   console.error(`ERROR: ${err} Related artist could not be discovered`);
  // }
  //---------------------------------------------------------

  //----------------------------------NOTE> using axios() -->
  try {
    const result = await axios({
      url: `${url}spotify/v1/artists/${currently_selected_items.id}/related-artists`,
      method: "GET",
      // headers: {
      //   Accept: "application/json",
      //   "Content-Type": "application/json",
      //   Authorization:
      //     "Bearer " +
      //     "BQCDvdPJ9l8CYpWUmsgp4Wtxw-Jrce-ztovWlO_n9mDYFy8iqSR3RKAcBPGe5ELjpQMx1-eKGgf4TLC2qBmHJNzmF2pJSL7csst_T-3xXyBHIEB2TFRe",
      // },
    });
    console.log(`result is: ${result}`);
    // const data = result.json();
    // console.log(`data is: ${data}`);
    return result.data;
  } catch (err) {}
};

//
//
//
// Search for Item -->
// https://developer.spotify.com/documentation/web-api/reference/#/operations/search
// https://api.spotify.com/v1/search?type=artist&q=genre:"rock"&limit=50
const getGenres = async (genre) => {
  const url = resetURLAddress();

  //----------------------------------NOTE> using fetch() -->
  // try {
  //   const result = await fetch(`${url}spotify/v1/search?type=artist&q=genre:"${genre}"&limit=50`, {
  //     method: "GET",
  //   });

  //   const data = await result.json();

  //   return data;
  // } catch (err) {
  //   console.error(`ERROR: ${err} Genre could not be discovered`);
  // }
  //---------------------------------------------------------

  //----------------------------------NOTE> using axios() -->
  try {
    const result = await axios({
      url: `${url}spotify/v1/search?type=artist&q=genre:"${genre}"&limit=50`,
      method: "GET",
      // headers: {
      //   Accept: "application/json",
      //   "Content-Type": "application/json",
      //   Authorization:
      //     "Bearer " +
      //     "BQCDvdPJ9l8CYpWUmsgp4Wtxw-Jrce-ztovWlO_n9mDYFy8iqSR3RKAcBPGe5ELjpQMx1-eKGgf4TLC2qBmHJNzmF2pJSL7csst_T-3xXyBHIEB2TFRe",
      // },
    });
    console.log(`result is: ${result}`);
    // const data = result.json();
    // console.log(`data is: ${data}`);
    return result.data;
  } catch (err) {}
};

// IMPORTANT > NOT USED! Does not retirve the correct information required to build algorithm...
//
//
// Get Recommendations -->
// https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recommendations
// https://api.spotify.com/v1/recommendations?seed_artists=4njbsdHClhSJG7w1kwZUbQ&seed_genres=dance
const getRecommendations = async (artist) => {
  const url = resetURLAddress();

  try {
    const result = await fetch(`${url}spotify/v1/recommendations?seed_artists=${artist.id}&limit=50`, {
      method: "GET",
    });

    const data = await result.json();

    return data;
  } catch (err) {
    console.error(`ERROR: ${err} Recommended artist could not be discovered`);
  }
};

//
//
//
// Uses as slighty different API to 'getRelated()' to match on id.
const getRelatedFromID = async (artist_id) => {
  // console.log(artist_id);
  const url = resetURLAddress();

  try {
    const result = await fetch(`${url}spotify/v1/artists/${artist_id}/related-artists`, {
      method: "GET",
    });

    const data = await result.json();

    return data;
  } catch (err) {
    console.error(`ERROR: ${err} Related artist could not be discovered`);
  }

  // PREVIOUS IMPLEMENTATION -->
  // const result = await fetch(`${window.location.href}spotify/v1/artists/${artist_id}/related-artists`, {
  //   method: "GET",
  // }).catch((err) => {
  //   console.error(`ERROR: ${err} Artist could not be discovered`);
  // });

  // const data = await result.json();
  // console.log(data);

  // return data;
};

// // IMPORTANT> NOT CURRENTLY USED (same as getRecommendations() above)
//
//
// https://api.spotify.com/v1/recommendations?seed_artists=${id}&limit=50
const getRecommendationsFromID = async (id) => {
  const url = resetURLAddress();

  try {
    const result = await fetch(`${url}spotify/v1/recommendations?seed_artists=${id}&limit=50`, {
      method: "GET",
    });

    const data = await result.json();
    console.log(data);

    return data;
  } catch (err) {
    console.error(`ERROR: ${err} Artist could not be discovered`);
  }
};

//
//
//
// When log in to Spotify event listener is launched this information is sent as a POST request to the Spotify server to ask for permission to retrieve the single log in page, sending the required information aquired from the Spotify Dashboard.
// Particular tokens have to be sent in order to be able to allow users to use this feature within the application
// In return Spotify sends back (in the browser URL) the session token, bearer type and expiery time for a person's log in session.
/*
This has to be managed throughout pages because of the way that web browsers and the Javascript stack works (on each new page load) 
*/
const getAuthPerUserLogin = async () => {
  try {
    const client_id = "ec16cb1a604b4204b895d057b9125038";
    const spotify_auth_endpoint = "https://accounts.spotify.com/authorize";
    const redirect_uri = "http://localhost:8000/";

    const space_deliminator = "%20";
    // SCOPES MAY NEED UPDATING DEPENDING ON WHAT IS BEEN RETIEVED -->
    const scopes = [
      "playlist-read-private",
      "playlist-modify-private",
      "playlist-modify-public",
      "user-read-recently-played",
    ];
    const scope_uri_params = scopes.join(space_deliminator);

    // changes onto Spotify log in page -->
    window.location = `${spotify_auth_endpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope_uri_params}&response_type=token&show_dialog=true`;

    // const otherdata = getSpotifyPlaylist();
    // console.log(otherdata);
  } catch (err) {
    console.error(`ERROR: ${err} Authorization not provided`);
  }
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//                           RECOMMENDATIONS PAGE                             //
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// IMPORTANT NOTE> NEED TO RETRIEVE 'token' which was saved from the home page into this new 'recommendation.js' page (currently using the token which gets returned from logging in, BUT - this causes data to not be loaded if not logging in through Spotify as token is not retrieved)

// // NOTE> was original to gather users profile name from Spotify API
//
//
//
// const getCurrentUserProfile = async (user_profile_name) => {
//   // const url = resetURLAddress();
//   // console.log(url);

//   try {
//     const result = await fetch(`https://api.spotify.com/v1/${user_profile_name}`, {
//       method: "GET",
//       // headers: { Authorization: "Bearer " + token },
//     });

//     const data = await result.json();
//     console.log(data);

//     return data;
//   } catch (err) {
//     console.log(`ERROR: ${err} Username could no be found`);
//   }
// };

//
//
//
// default export (ALSO USED TO GATHER USERNAME (currently)) -->
const getUsernameAndSpotifyPlaylist = async () => {
  // const url = resetURLAddress();
  // console.log(url);

  // returned from uri params -->
  const token = localStorage.getItem("accessToken");

  //----------------------------------NOTE> using fetch() -->
  // try {
  //   const result = await fetch(`https://api.spotify.com/v1/me/playlists`, {
  //     method: "GET",
  //     headers: { Authorization: "Bearer " + token },
  //   });

  //   const data = await result.json();

  //   return data;
  // } catch (err) {
  //   console.log(`ERROR: ${err} Authorization not accepted`);
  // }
  //---------------------------------------------------------

  //----------------------------------NOTE> using axios() -->
  try {
    const result = await axios({
      url: `https://api.spotify.com/v1/me/playlists`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return result.data;
  } catch (err) {
    console.log(`ERROR: ${err} Authorization not accepted`);
  }
  //---------------------------------------------------------
};

//
//
//
//
const createPlaylist = async (username) => {
  // IMPORTANT> DO NOT DELETE -------------------------------------------------------------->
  // const url = resetURLAddress();
  // console.log(url);
  // const url = "http://localhost:8000/";

  // stored from recommendation.js page load where username is captured. NOTE> NOT THE ORGINAL TOKEN -->
  // IMPORTANT NOTE> IDEALLY WANT THE ORIGIAL AQUIRED TOKEN (if possible to use)!...
  const token = localStorage.getItem("accessToken");
  // console.log(token);

  //----------------------------------NOTE> using fetch() -->
  // https://api.spotify.com/v1/users/user_id/playlists
  // ${url}/v1/users/${username}/playlists
  // try {
  //   await fetch(`https://api.spotify.com/v1/users/${username}/playlists`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + token,
  //     },
  //     body: JSON.stringify({
  //       name: "🎼 Artistree Recommendations Playlist 🎼",
  //       public: true,
  //     }),
  //   });
  // } catch (err) {
  //   console.log(`ERROR: ${err} Username not authorized`);
  // }
  //-------------------------------------------------------->

  //----------------------------------NOTE> using axios() -->
  try {
    await axios({
      url: `https://api.spotify.com/v1/users/${username}/playlists`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        name: "🎼 Artistree Recommendations Playlist 🎼",
        public: true,
      },
    });
  } catch (err) {
    console.log(`ERROR: ${err} Username not authorized`);
  }
  //-------------------------------------------------------->
};

//
// USES WEBSERVER AND ORIGINAL TOKEN/HANDLER FUNCTION
//
// https://api.spotify.com/v1/artists/id/top-tracks
const getArtistTopTracks = async (id) => {
  // const url = resetURLAddress();
  // console.log(url);

  const url = window.location.origin + "/";

  // returned from uri params -->
  // const token = localStorage.getItem("accessToken");
  // console.log(token);

  //----------------------------------NOTE> using fetch() -->
  // try {
  //   const result = await fetch(`${url}spotify/v1/artists/${id}/top-tracks?market=GB`, {
  //     method: "GET",
  //     // headers: {
  //     //   "Content-Type": "application/json",
  //     // },
  //   });

  //   const data = await result.json();

  //   return data;
  // } catch (err) {
  //   console.log(`ERROR: ${err} Artists not discovered`);
  // }
  //-------------------------------------------------------->

  //----------------------------------NOTE> using axios() -->
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
  //-------------------------------------------------------->
};

//
//
//
// https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artists-top-tracks
// BASED ON ISO 3166-1 alpha-2 REGION CODE
const addItemToSpotifyPlaylist = async (playlist_id, track_uri) => {
  const token = localStorage.getItem("accessToken");

  //----------------------------------NOTE> using fetch() -->
  // try {
  //   await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uris=${track_uri}`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + token,
  //     },
  //   });
  // } catch (err) {
  //   console.log(`ERROR: ${err} Username not authorized`);
  // }
  //-------------------------------------------------------->

  //----------------------------------NOTE> using axios() -->
  try {
    await axios({
      url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uris=${track_uri}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
  } catch (err) {
    console.log(`ERROR: ${err} Username not authorized`);
  }
  //-------------------------------------------------------->
};

// HAD TO BE IMPLEMENTED, BUT NOW IT DOESNT..... (mention in report about default exports) -->
// export default getUsernameAndSpotifyPlaylist;

export {
  getArtist,
  getRelated,
  getGenres,
  getRecommendations,
  getRelatedFromID,
  getRecommendationsFromID,
  getAuthPerUserLogin,
  resetURLAddress,
  getUsernameAndSpotifyPlaylist,
  // getCurrentUserProfile,
  createPlaylist,
  getArtistTopTracks,
  addItemToSpotifyPlaylist,
};
