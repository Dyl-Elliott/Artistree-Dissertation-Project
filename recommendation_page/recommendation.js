"use strict";

import DataminingHandler from "../dataframe.js";

import {
  getUsernameAndSpotifyPlaylist,
  createPlaylist,
  getArtistTopTracks,
  addItemToSpotifyPlaylist,
} from "../spotify_website_module.js";

// const plot_div = document.getElementsById("plot_div");

const refresh_page_button = document.querySelector(".refresh_page_button");

const recommended_artists = document.getElementById("recommendations");
const get_playlist_button = document.getElementById("get_playlist_button");
const create_playlist_button = document.getElementById("create_playlist_button");
const playlist_items_container = document.getElementById("playlist_items_container");

const home_button = document.getElementById("home_text");

// const add_to_playlist_button = document.querySelector(".add_to_playlist_button");
// const top_tracks_container = document.querySelector(".top_tracks_container");

class Recommendations {
  // NOTE> Should maybe clear local storage here?
  constructor() {
    this.session_token_recieved = window.localStorage.getItem("accessToken");
    this.cross_page_df = [];
    this.recommendations_to_display = [];

    this.selected_playlist = "";
    this.selected_playlist_id = "";
    this.playlist_information = [];

    // this.artist_top_tracks = [];
    // this.top_tracks_collection = [];
    // this.top_tracks = [];

    this.artist_reference_id_list = [];

    this.logged_in_state = window.localStorage.getItem("loggedInState");

    this.artists_currently_been_displayed = [];
    // this.local_storage_facility = JSON.stringify(localStorage.getItem("artistAlreadyRecommended"));

    this.localstorage_artists = [];

    // this.artist_id_added_arr = [];

    this.currently_stored_in_localstorage = [];

    this.ids = [];
  }

  //
  //
  //
  //
  invokeCrossPageDF = async () => {
    console.log("invokeCrossPageDF ran");

    // retrieve results from algortihm in script.js -->
    rec.cross_page_df = JSON.parse(localStorage.getItem("cross-page_df"));

    console.log(rec.cross_page_df);
    // console.log(rec.local_storage_facility);

    // this.logged_in_state = "false";
    // console.log(this.session_token_recieved);

    if (this.logged_in_state === "true" && this.session_token_recieved !== "undefined") {
      // collects username for playlist assignment -->
      const data = await getUsernameAndSpotifyPlaylist();
      // console.log(data);

      // splits and collects username from given index -->
      const link = data.href.split("/");
      const username = link[5];

      // save users username to local storage to be used to gather playlist information -->
      localStorage.setItem("username", username);
    } else {
      // hide playlist buttons and add tracks buttons if user has not logged in -->
      get_playlist_button.style.display = "none";
      create_playlist_button.style.display = "none";
    }

    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////
    /////                            For DataFrame display                          /////
    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////

    // IMPORTANT NOTE> STILL NEED TO RE-CONFIGURE ITEM NUMBERS TO FLOW CORRECTLY (if now required) -->

    // // retain just the values from the array of objects sent from import -->

    // const data = rec.cross_page_df.map(function (recommendations) {
    //   console.log(recommendations);
    //   return [recommendations.item, recommendations.artist, recommendations.id, recommendations.popularity];
    // });

    // console.log(data);

    // // TO DISPLAY THE NUMBER OF RECOMMENDATIONS AS A VALUE WITHIN TEXT -->
    // // const text_node = document.createElement("p");
    // // text_node.innerHTML = `Here are your <b>${data.length}</b> recommendations!`;
    // // document.getElementById("recommendation_counter_output").appendChild(text_node);

    // const dm = new DataminingHandler();
    // dm.newDF(data);
    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////
  };

  //
  //
  //
  //
  SelectRecommendations = async (cross_page_df) => {
    const popularity_caviate = 20;

    // IMPORTANT NOTE> NEED TO HANDLE CASES WHERE THE USER HAS PRESSED REFRESH MORE TIMES THAN THERE ARE ITEMS AVAILABLE TO DISPLAY
    // removes artists which have already been recommended on previous page loads from cross_page_df -->
    this.removeAlreadyRecommendedArtistsFromDF(cross_page_df);
    console.log(cross_page_df);

    // generates a list of less popular artists to recommend (based on popularity_caviate) -->
    const lesser_popular_artists = cross_page_df.filter(function (artist) {
      return artist.popularity <= popularity_caviate;
    });
    // lesser recommendations -->
    const lesser_artists = rec.getWithLesserPopularity(lesser_popular_artists);
    console.log(`artists with a popularity less than or equal to ${popularity_caviate} are:`);
    console.log(lesser_artists);

    // generates a list of higher popular artists to recommend (based on popularity_caviate) -->
    const higher_popular_artists = cross_page_df.filter(function (artist) {
      return artist.popularity >= popularity_caviate;
    });
    // greater recommendations -->
    const greater_artists = rec.getWithGreaterPopularity(higher_popular_artists, lesser_popular_artists);
    console.log(`artists with a popularity greater than ${popularity_caviate} are:`);
    console.log(greater_artists);

    // compiles box list of artists which are to be displayed (after defining which ones to display) of 20 artists -->
    rec.createArtistsForRecommenadtionsList(lesser_artists, greater_artists);

    // NOTE> by this point we have a list of 20 recommendations split (~17/~3) to display to the user

    // whole UI is developed before event listeners are added to each of the top_track_containers (track.name + add_button), this then allows the eventListeners to be added to each individual section -->
    await rec.populateDOMWithArtistRecommendations();

    ///////////////////////////////////////////////////////////////////////

    // collects all top track containers at once -->
    // let recommendation_list_box = event.target.parentNode.parentNode.parentNode.parentNode;
    let listOf_top_tracks_container = document.querySelectorAll(".top_tracks_container");

    // iterate over each top track container adding an event listener to each container -->
    listOf_top_tracks_container.forEach(function (container) {
      container.addEventListener("click", async (event) => {
        // NOTE> can add if conditional checks to guard clause --> (USING DELIGATION to find specific button click events)

        // event to find which top_tracks_container has been clicked using 'target' -->
        let parent_node = event.target.closest(".top_tracks_container");

        // uses the 'parent_node' to access the list element containing the song name realting to which a coresponding button (directly next to it) from within the 'top_tracks_container' -->
        const song = parent_node.querySelector(".track_list_item").innerText;

        let track_to_add_to_playlist;

        // finds the track object realting to the song name which is to be added to the playlist -->
        rec.artist_reference_id_list.forEach(function (item) {
          if (item.name === song) {
            track_to_add_to_playlist = item;
          }
        });

        // console.log(track_to_add_to_playlist);
        // console.log(rec.selected_playlist_id);
        // console.log(rec.session_token_recieved);

        if (rec.logged_in_state === "true" && rec.session_token_recieved !== "undefined") {
          // checks if has a value -->
          if (track_to_add_to_playlist && rec.selected_playlist_id.length > 0) {
            // using selected song name_id and playlist_id === adds song directly to personal Spotify playlist -->
            await addItemToSpotifyPlaylist(rec.selected_playlist_id, track_to_add_to_playlist.uri);
          } else {
            alert("You need to select a playlist to add to first");
          }
        } else {
          // alert("Must be logged in to access tracks to add to playlist");
        }
      });
    });
  };

  //
  //
  //
  //
  removeAlreadyRecommendedArtistsFromDF = function (cross_page_df) {
    console.log(cross_page_df);

    // first instance will be a list of 20 artists already recommended -->
    let already_recommended = JSON.parse(localStorage.getItem("artistAlreadyRecommended"));
    console.log(already_recommended);

    let cross_page_df_copy = JSON.parse(localStorage.getItem("cross-page_df"));
    console.log(cross_page_df_copy);

    let ids = [];
    cross_page_df.forEach(function (item) {
      ids.push(item.id);
    });
    console.log(ids);

    if (already_recommended !== null) {
      for (let artist_id of already_recommended) {
        if (ids.includes(artist_id.id)) {
          // remove it at that index so it does not get suggested again
          let index_to_remove_at = cross_page_df.findIndex((obj) => obj.id === artist_id.id);
          // console.log(index_to_remove_at);

          cross_page_df_copy.splice(index_to_remove_at, 1);

          // NOTE> NEED TO REMOVE FROM ACTUAL LOCAL STORAGE ACESSIBILITY
        }
      }
    }

    localStorage.setItem("cross-page_df", JSON.stringify(cross_page_df_copy));
  };

  //
  //
  //
  // Designed to collate ~17 artist with popularty less or equal to ~20.
  getWithLesserPopularity = function (lesser_popular) {
    // const number_of_artists_to_display = Math.ceil(less_than_11.length / 5);
    const number_of_artists_to_display = 17;
    let artists = [];
    let checked_index = [];

    while (artists.length < number_of_artists_to_display) {
      let index_number = Math.floor(Math.random() * lesser_popular.length);
      // console.log(index_number);

      if (!checked_index.includes(index_number)) {
        checked_index.push(index_number);
        artists.push(lesser_popular[index_number]);

        // used to track what artists have already been displayed to the user so they do not see the same ones when the 'Refresh for more recommendations' button is clicked -->
        // window.localStorage.setItem(this.artists_already_been_displayed.push(lesser_popular[index_number].id));
      }
    }

    return artists;
  };

  //
  //
  //
  // Designed to collate ~3 artist with popularty equal to or greater ~20.
  getWithGreaterPopularity = function (more_popular, less_popular) {
    // const number_of_artists_to_display = Math.ceil(greater_than_11.length / 5);
    const number_of_artists_to_display = 3;
    let artists = [];
    let checked_index = [];

    // console.log(more_popular);
    // console.log(less_popular);

    if (more_popular.length >= number_of_artists_to_display) {
      while (artists.length < number_of_artists_to_display) {
        let index_number = Math.floor(Math.random() * more_popular.length);
        if (!checked_index.includes(index_number)) {
          checked_index.push(index_number);
          artists.push(more_popular[index_number]);
        }
      }
    } else {
      // NOTE> FOR CASES WHERE NOT ENOUGH HIGHER POPULAR ARTISTS (caviate ~20) ARE RETURNED -->
      // collect the artist(s) which are greater than caviate popularity split, and then fill the remainder with lesser popularity artists

      // push in the more popular artists into 'artists' which do exist -->
      more_popular.forEach(function (artist) {
        artists.push(artist);
        console.log(artist);
      });

      // fill the remaining spaces required with lesser popular artists -->
      while (artists.length < number_of_artists_to_display) {
        let index_number = Math.floor(Math.random() * less_popular.length);
        if (!checked_index.includes(index_number)) {
          checked_index.push(index_number);
          artists.push(less_popular[index_number]);
        }
      }
    }

    return artists;
  };

  //
  //
  //
  //
  createArtistsForRecommenadtionsList = function (lesser, greater) {
    this.recommendations_to_display.push(...lesser, ...greater);
    // console.log(this.recommendations_to_display);

    this.sortAPIArtistDataByPopularity(this.recommendations_to_display);
    // console.log(this.recommendations_to_display);

    this.recommendations_to_display.forEach(function (artist) {
      rec.artists_currently_been_displayed.push({ id: artist.id });
    });

    // console.log(this.recommendations_to_display);
  };

  //
  //
  //
  //
  sortAPIArtistDataByPopularity = function (recommendations_arr) {
    recommendations_arr.sort(function (a, b) {
      return a.popularity - b.popularity;
    });
  };

  //
  //
  //
  //
  populateDOMWithArtistRecommendations = async () => {
    console.log(rec.recommendations_to_display);

    if (rec.recommendations_to_display.length > 0) {
      for (let artist of rec.recommendations_to_display) {
        // holds upto top ~10 tracks for each artist displayed -->
        let artist_top_tracks_to_display = await rec.topTracks(artist);
        // console.log(artist_top_tracks_to_display);
        // console.log(rec.recommendations_to_display);

        let top_tracks_formatted = [];

        for (let i = 0; i < artist_top_tracks_to_display?.tracks.length; i++) {
          if (rec.logged_in_state === "true" && this.session_token_recieved !== "undefined") {
            top_tracks_formatted.push(
              `<div class="top_tracks_container" >
                <li class="track_list_item">${artist_top_tracks_to_display?.tracks[i]?.name}</li>
                ${
                  rec.logged_in_state === "true" && this.session_token_recieved !== "undefined"
                    ? `<button class="add_to_playlist_button">Add</button>`
                    : ""
                }
              </div>`
            );
          } else {
            // different formatting for display tracks when user is not logged in -->
            top_tracks_formatted.push(
              `<div class="top_tracks_container" style="justify-content: center;">
              <li class="track_list_item">${artist_top_tracks_to_display?.tracks[i]?.name}</li>
              ${
                rec.logged_in_state === "true" && this.session_token_recieved !== "undefined"
                  ? `<button class="add_to_playlist_button">Add</button>`
                  : ""
              }
            </div>`
            );
          }
        }

        // removes commas between tracks -->
        top_tracks_formatted = top_tracks_formatted.join(" ");

        // create list element for each artists related box -->
        const artist_list_entry = document.createElement("li");
        artist_list_entry.classList.add("artist_dropdown_item");

        // inserting information relative to each artist inside each artist element box item -->
        if (artist.hasOwnProperty("image")) {
          artist_list_entry.innerHTML = `
        <div class="recommendation_list">
          <p class="artist_name">${artist.artist} <br>
           (Genre: ${artist.genre.length > 0 ? artist.genre[0] : "No genre defined"})</p>
            <div class="drop_down_image_box">
              <img src="${artist.image.url}">
              <h1>${artist.artist} top tracks are: </h1>
              <ul class="top_tracks_box">
              ${
                top_tracks_formatted.length > 0
                  ? top_tracks_formatted
                  : "No top tracks found - You can try manually searching for this artist on Spotify!"
              }
              </ul>
          </div>
        </div>`;
          // for cases where no url image has been found for an artist -->
        } else {
          artist_list_entry.innerHTML = `
          <div class="recommendation_list">
            <p class="artist_name">${artist.artist} <br>
           (Genre: ${artist.genre.length > 0 ? artist.genre[0] : "No genre defined"})</p>
            <div class="drop_down_image_box">
              <img src="https://www.afrocharts.com/images/song_cover-500x500.png">
              <h1>${artist.artist} top tracks are: </h1>
              <ul class="top_tracks_box">${
                top_tracks_formatted.length > 0
                  ? top_tracks_formatted
                  : "No top tracks found - You can try manually searching for this artist on Spotify!"
              }</ul>
          </div>
        </div>`;
        }

        // inserting item to the DOM (per artist) -->
        recommended_artists.appendChild(artist_list_entry);
      }
    } else {
      const message = document.getElementById("no_more_recommendations_message");
      message.innerHTML =
        "There are no more artists to recommend based on this search, please return to the home page and try another set of artists 💁‍♂️";
    }
  };

  //
  //
  //
  //
  topTracks = async (artist) => {
    let result = await getArtistTopTracks(artist.id);

    for (let i = 0; i < result.tracks.length; i++) {
      rec.artist_reference_id_list.push(result.tracks[i]);
    }

    // console.log(rec.artist_reference_id_list);

    return result;
  };

  //
  //
  //
  //
  displayExistingPlaylistItem = function (playlist_data) {
    ////////////////////////////////////////////////////////////
    // const playlist_list_item = document.createElement("li");
    // playlist_list_item.classList.add("playlist_list");

    // playlist_data?.items
    //   ? playlist_data.items.map(function (item) {
    //       // console.log(item.name);

    //       // const li = document.createElement("li");
    //       // li.classList.add("playlist_list_item");
    //       // li.innerHTML = `<div class="item_name">${item.name}</div>`;

    //       // playlist_items_container.appendChild(li);

    //       playlist_items_container.innerHTML = `<li class="playlist_item"></li>`;

    //       // NOTE> 20/01/23 - NEXT - add click event to each item to which the user wants to save a selected track to
    //     })
    //   : null;
    // // IMPORTANT NOTE> May need to pass in additional scopes into GET request to allow this functionality!
    //////////////////////////////////////////////////////////

    playlist_items_container.innerHTML = `<li class="playlist_item"></li>`;
    const playlist_item_selected = document.querySelector(".playlist_item");

    rec.loadPlaylistData(playlist_data, playlist_item_selected);

    console.log(rec.playlist_information);

    playlist_items_container.addEventListener("click", function (event) {
      rec.selected_playlist = event.target.innerText;
      console.log(`Playlist: "${rec.selected_playlist}" has been selected`);

      // GET PLAYLIST ID -->
      rec.playlist_information.forEach(function (item) {
        if (item.playlist_name.includes(rec.selected_playlist)) {
          rec.selected_playlist_id = item.playlist_id;
        }
      });
      console.log(`Playlist id selected: ${rec.selected_playlist_id}`);

      // remove list of playlist items once selected (item saved in selected_playlist) -->
      playlist_items_container.removeChild(playlist_item_selected);
    });

    // NOTE> Add Items to Playlist
    // https://developer.spotify.com/documentation/web-api/reference/#/operations/add-tracks-to-playlist
  };

  //
  //
  //
  //
  loadPlaylistData = function (playlist_data, list_element) {
    let innerElement = "";
    list_element.innerHTML = "";

    playlist_data.items.forEach(function (item) {
      console.log(item);
      innerElement += `<li class="playlist_item_name">${item.name}</li>`;

      // to test against name and playlist id -->
      rec.playlist_information.push({ playlist_name: item.name, playlist_id: item.id });
    });

    list_element.innerHTML = innerElement;
  };

  //
  //
  //
  //
  // loadTopTracksData = async (top_tracks_data) => {
  //   console.log(top_tracks_data);
  //   let top_tracks = [];

  //   // NOTE> NEED TO HANDLE CASES WHERE THERE RETURNS 0 TRACKS!
  //   top_tracks_data.forEach(function (item) {
  //     // console.log(item.tracks.name);

  //     for (let track of item.tracks) {
  //       console.log(track.name);

  //       // alternative functionality -->
  //       // let div_add = document.createElement("div");
  //       // div_add.className = ".top_tracks_container";

  //       // let list_add = document.createElement("li");
  //       // list_add.className = ".track_list_item";
  //       // list_add.innerHTML = `${track?.name}`;

  //       // let button_add = document.createElement("button");
  //       // button_add.className = ".add_to_playlist_button";
  //       // button_add.innerHTML = "Add";

  //       // div_add.appendChild(list_add);
  //       // div_add.appendChild(button_add);

  //       // top_tracks.push(div_add);

  //       top_tracks.push(
  //         `<div class="top_tracks_container">
  //           <li class="track_list_item">${track?.name}</li>
  //           <button class="add_to_playlist_button">Add</button>
  //         </div>`
  //       );
  //     }
  //   });

  //   return top_tracks;
  // };
}
const rec = new Recommendations();

await rec.invokeCrossPageDF(); // <-- NOTE> could maybe still use an IIFE?
await rec.SelectRecommendations(rec.cross_page_df);

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////                               Event Listeners                             /////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

//
//
//
home_button.addEventListener("click", function () {
  // IMPORTANT BUG> accessToken, expiresIn & tokenType reset!.....
  // NOTE> could potentially pass through the url which includes the data we need from the previous sign in (from script.js)
  /*
  http://localhost:8000/#access_token=BQD3PdCFe2q33l6GoAD4kVSdnfX-vAV8hZTXwmc2Skzwu_wqHMmop6YN94I5i8320xxJOVIeZ6YujDTGvx-7VW_0rua1N7zaK0PNsUG-aEyJFBKHnn53wb84wzwwZRO2daLwawvz-KQ-GUVhOrAtfNuaRLVXFtkZKFO6554FSzMiGsOL4xjh3ENhTgYlDK882XeWmU4z0avTsDaVEcZL8eQIEbI3&token_type=Bearer&expires_in=3600
  */
  if (localStorage.getItem("loggedInState") === "true") {
    // re-direct to home page with the correct url for log in validation -->
    const redirect_URL_with_login_session = `${window.location.origin}/#access_token=${localStorage.getItem(
      "accessToken"
    )}&token_type=${localStorage.getItem("tokenType")}&expires_in=${localStorage.getItem("expiresIn")}`;
    console.log(redirect_URL_with_login_session);

    // NOTE> clear artistsAlreadyRecommended? -->
    localStorage.removeItem("artistAlreadyRecommended");

    window.location.href = redirect_URL_with_login_session;
  } else {
    localStorage.removeItem("artistAlreadyRecommended");

    window.location.href = window.location.origin;
  }
});

//
//
//
refresh_page_button.addEventListener("click", function () {
  // used to hold all ids which have currently been displayed to user -->
  // rec.artist_id_added_arr.push(rec.artists_already_been_displayed);

  // used to concat artists already displayed to local storage item -->
  // console.log(rec.artist_id_added_arr);
  console.log(rec.artists_currently_been_displayed);
  console.log(rec.localstorage_artists);

  // runs on first instance -->
  if (!localStorage.getItem("artistAlreadyRecommended")) {
    // take all of the artists from first page instance and add them to local storage -->
    rec.localstorage_artists.push(JSON.stringify(rec.artists_currently_been_displayed));
    // and then we add all the 20 items to local storage -->
    window.localStorage.setItem("artistAlreadyRecommended", rec.localstorage_artists);
  } else {
    // get whats already been stored in local storage -->
    rec.currently_stored_in_localstorage = JSON.parse(localStorage.getItem("artistAlreadyRecommended"));

    // TO WORK THROUGH WHAT IS CURRENTLY EXISTING -->
    rec.currently_stored_in_localstorage.forEach(function (item) {
      rec.ids.push(item.id);
    });

    for (let item of rec.artists_currently_been_displayed) {
      if (!rec.ids.includes(item.id)) {
        rec.currently_stored_in_localstorage.push({ id: item.id });
      }
    }
    window.localStorage.setItem("artistAlreadyRecommended", JSON.stringify(rec.currently_stored_in_localstorage));
  }

  // reload the page with local storage changes -->
  window.location.reload();
});

//
//
//
get_playlist_button.addEventListener("click", async () => {
  try {
    const playlist_data = await getUsernameAndSpotifyPlaylist();
    console.log(playlist_data);

    rec.displayExistingPlaylistItem(playlist_data);

    // NOTE> NEXT - add event listeners to each selection to collate which playlist to add selected tracks to
    // capture "playlist ID"
  } catch (err) {
    console.log(`${err}: Is user logged in?`);
  }
});

//
//
//
create_playlist_button.addEventListener("click", async () => {
  const username = localStorage.getItem("username");
  // const username = "takeabow88";

  await createPlaylist(username);
  // NOTE> do a modal window instead?
  alert("Your new Artistree playlist has created on your Spotify account!");
});

// REF LINK -->
// https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artists-top-tracks
// BASED ON ISO 3166-1 alpha-2 REGION CODE

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////                               Notes Section                               /////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// NOTE> 23/01/23 - Need to make it when the user is not logged in that they dont get the ability to select a playlist or be able to add tracks via this feature
//  - Sort out token for API calls on this page

// display "genre" for each artist in the list

//////////////////////////
// NOTE> 20/01/23 - Possible implementations could include -->
// hover rotate to show band information
// API call to get a list of songs to add to playlist (when logged in)
// bring back top 5 most popular songs (like on Spotify artist page)

// HIPSTER API SEARCH (not complete) -->
// https://api.spotify.com/v1/search?q=tag:hipster&type=artist

// Gap in the market to produce a application which doesnt promote based on interaction
// How does the data get returned - is it just from a pool of data??
// artist returned are often static and the same throughout, does not seem feasable to return low popularity artists

// HOW IS THE RETURNED DATA BASED ON? even when using :hipster it seems to return the same data each time - is it automated? What is the metric that is returned on???

// Check for similarities in the data (as correlation) and compare them

////////////////////////////////////////////////////////////////

// IIFE -->
// used to call the locally stored data on page load -->
// (() => {
//   const cross_page_df = JSON.parse(localStorage.getItem("cross-page_df"));
//   console.log(cross_page_df);

//   // retain just the values from the array of objects sent from import -->
//   const data = cross_page_df.map(function (recommendations) {
//     console.log(recommendations);
//     return [recommendations.item, recommendations.artist, recommendations.id, recommendations.popularity];
//   });

//   console.log(data);

//   const text_node = document.createElement("p");
//   // text_node.innerHTML = `Here are your <b>${data.length}</b> recommendations!`;
//   document.getElementById("recommendation_counter_output").appendChild(text_node);

//   const dm = new DataminingHandler();
//   dm.newDF(data);
// })();
