"use strict";

import {
  getArtist,
  getRelated,
  getGenres,
  getRecommendations, // <-- no longer used (could be used to compare results of complexity)
  getRelatedFromID, // <-- NOTE> could use normal getRelated() instead?
  getRecommendationsFromID, // <-- not used
  getAuthPerUserLogin,
  resetURLAddress,
  // getCurrentUserProfile,
} from "./spotify_website_module.js";
import genreJSON from "./genreJSON/genres";

////////////////////////////////////////////////////////////////////////////////////
///                                   COOKIES                                    ///
////////////////////////////////////////////////////////////////////////////////////
// fetch("/cookie").then((response) => {
//   const data = response.json().then((data) => {
//     console.log(data);

//     document.cookie = "session_token=" + data.cookie;
//   });

//   console.log(data);
// });
////////////////////////////////////////////////////////////////////////////////////

// import DataminingHandler from "./dataframe.js";
// import DFHandler from "./recommendation_page/recommendation.js";

// const first_selection_list = document.querySelector("#selection1");
// const second_selection_list = document.querySelector("#selection2");
// const third_selection_list = document.querySelector("#selection3");
// const main_section = document.querySelector(".main_section");

const log_in_to_spotify = document.getElementById("log_in_spotify");

const first_textbox = document.querySelector("#entry1");
const second_textbox = document.querySelector("#entry2");
const third_textbox = document.querySelector("#entry3");

const band_image_1 = document.querySelector(".band_image1");
const band_image_2 = document.querySelector(".band_image2");
const band_image_3 = document.querySelector(".band_image3");

const user_message = document.getElementById("user_message");

const suggestion_1 = document.querySelector("#suggestion_1");
const suggestion_2 = document.querySelector("#suggestion_2");
const suggestion_3 = document.querySelector("#suggestion_3");

const did_you_mean_message_text = document.querySelector(".did_you_mean");
const genre_certify_container = document.getElementById("genre_certify");

const get_recommendations_button = document.getElementById("search_button");

const home_text = document.getElementById("home_text");

export default class App {
  constructor() {
    this.artist_name = "";
    this.artist_information = "";
    this.currently_selected_items = [];

    this.event_one_captured = false;
    this.event_two_captured = false;
    this.event_three_captured = false;

    this.artist_genre_index = 0;

    this.related_artists_set_one = [];
    this.related_artists_set_two = [];
    this.related_artists_set_three = [];

    this.related_by_genre = [];

    this.recommended_artists_set_one = [];
    this.recommended_artists_set_two = [];
    this.recommended_artists_set_three = [];

    this.user_defined_genre = "";

    this.df_item_number = 0;
    this.db_information = [];

    this.recommendation_result = [];
    this.less_popular_artists = [];
    this.API_related_artists = [];

    this.logged_in = false;

    this.session_access_token = "";
  }

  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  ///                                  FUNCTIONS                                   ///
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////

  //
  //
  // Capatalizes first letter of each word once split by spaces.
  // This is required as when sending a request of a band to Spotify the format
  //  which is provided by the user is case sensitive.
  // Additional implementation transforms the artist name search inclusive with a #.
  //  e.g., red hot chilli peppers === Red Hot Chilli Peppers# (with deliminator)
  //  This has been included to divert from checking the artist name against the
  //  first object which is returned - instead now, will always display list of
  //  artists which can be selected from (rather than choosing the first object returned)
  formatArtistName = function (artist_name) {
    let artist_arr = artist_name.trim().split(" ");

    // NOTE> verification on actual input should be here?
    // if search can not be found (i.e., ";") or search is invalid (i.e., " ")
    for (let i = 0; i < artist_arr.length; i++) {
      artist_arr[i] = artist_arr[i][0].toUpperCase() + artist_arr[i].substr(1);
    }

    // # makes the search go to list items -->
    const artist_name_formatted = artist_arr.join(" ") + "#";

    console.log(artist_name_formatted);
    return artist_name_formatted;
  };

  //
  //
  // Collects the genres which have arrived with the data from Spotify API call
  //  regarding each artists genre information.
  // Returns list of genres which artists contains (if any are present).
  getGenresList = function (artist) {
    const artist_genre_list = [];
    artist.genres.forEach((genre) => {
      artist_genre_list.push(genre);
    });

    return artist_genre_list;
  };

  //
  //
  // Dynamically insterts a list of genres which have been provided from text field entry.
  // This list changes depending on the input of the text field when the user is typing
  //  their expectation of genres which are to be returned, and then to be chosen from.
  loadGenreData = function (genre, element) {
    element.innerHTML = "";
    let innerElement = "";

    genre.forEach(function (item) {
      innerElement += `<li>${item}</li>`;
    });

    element.innerHTML = innerElement;
  };

  //
  //
  // Iterates through the list of genres which are contained in Genres.js
  //  (which has been loaded by this point) and check each character input on whether
  //  it is contained with the full list of genres which Spotify manages.
  filterGenres = function (genre, searchText) {
    let list_return = [];

    if (searchText.length > 1) {
      for (let i = 0; i < genre.length; i++) {
        if (genre[i].includes(searchText)) {
          list_return.push(genre[i]);
        }
      }
    }

    return list_return;
  };

  //
  //
  // Discovers the most frequently occuring genre which is then used as a
  //  Spotify API call to gather data based on the specified genre which is returned
  //  from this function.
  // source: --> https://javascript.plainenglish.io/how-to-find-the-most-frequent-element-in-an-array-in-javascript-c85119dc78d2
  getMostFrequent = function (genre) {
    const hashmap = genre.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(hashmap).reduce((a, b) => (hashmap[a] > hashmap[b] ? a : b));
  };

  //
  //
  // Dynamically creates a list of entries to be selected from based on the users search.
  // A total of 10 artists will be displayed and will then require the user to provide a
  //  selection based on which artist they meant to choose.
  // This function is required when an artist cannot be discovered on first search instance
  //  and is used to validate the users selection.
  listEntries = async (data, text_box, band_image, suggestion, did_you_mean) => {
    console.log(data);
    const artist_list_entries = data.artists.items.map((element, i) => {
      return element;
    });

    artist_list_entries.forEach((artist) => {
      // CREATE A LIST ITEM WHICH IS TO BE DYNAMICALLY ADDED -->
      const artist_list_entry = document.createElement("li");
      artist_list_entry.classList.add("artist_dropdown_item");

      // CHECK WHETHER THE ARTISTS BEEN RETURNED HAS AN IMAGE TO DISPLAY, THEN INSTERTS THIS -->
      artist_list_entry.innerHTML = `
      <div class="big_box">
      ${
        artist.images.length > 0
          ? `
        <div class="drop_down_image_box">
          <img src="${artist.images[0].url}">
        </div>`
          : `<div class="drop_down_image_box">
          <img src="https://www.afrocharts.com/images/song_cover-500x500.png">
        </div>`
      }
        <div class="m-2">
            ${artist.name}
        </div>
      </div>
      `;
      // APPENDS THE SPECIFIC LIST SUGGESTION OT THE PAGE -->
      suggestion.appendChild(artist_list_entry);

      // NOTE> attempting to remove pop up keyboard on mobile to moving to list event -->
      // const tb = document.querySelector(".text_box");
      // if (KeyboardEvent.code === "Enter") {
      //   tb.blur();
      // }

      // SMOOTH SCROLL TO THAT SECTION OF THE PAGE -->
      const scroll_to = document.querySelector(".artist_dropdown_item");
      const scroll_to_cords = scroll_to.getBoundingClientRect();

      window.scrollTo({
        left: scroll_to_cords.left + window.pageXOffset,
        top: scroll_to_cords.top + window.pageYOffset,
        behavior: "smooth",
      });
      // NOTE - FOR MOBILE POP-UP KEYBOARD WHEN SEARCHING FOR ARTISTS FROM HOME PAGE -->
      // navigator.virtualKeyboard.hide();

      // LIST IS GENERATED AND THEN CLICK EVENT OCCURS DIRECTLY ON LIST ITEMS -->
      artist_list_entry.addEventListener("click", function () {
        console.log(`"${artist.name}" has been selected`);
        console.log(artist);

        // COLLECTS GENRES WHICH ARTIST HAS INCLUDED IN RETURNED OBJECT -->
        const artist_genre_list = app.getGenresList(artist);
        // THIS IS GOING TO BE THE COLLATED LIST OF BANDS SELECTED AND THE INFORMATION CONTAINED PER ARTIST -->
        app.currently_selected_items.push({
          name: artist.name,
          genres: artist_genre_list.join(", ").toString(),
          id: artist.id,
          image: artist.images[0],
        });
        console.log(app.currently_selected_items);

        // ARE THERE NO GENRES BEEN FOUND? -->
        if (artist_genre_list.length === 0) {
          console.log("no genre found");

          // ASK THE USER TO CLARIFY THE GENRE OF THE ARTIST (as one was not returned) -->
          genre_certify_container.innerHTML = `
          <input size="30" id="genre_define" style="margin: 25px auto;
            display: flex;
            align-content: center;
            align-items: center;
            "placeholder='Define a genre for this artist'>
          <ul id="genre_list"></ul>
          `;

          let genre_define = document.getElementById("genre_define");
          let genre_list = document.getElementById("genre_list");
          let list_information = document.getElementById("list_information");

          // LOADS IN THE GENRES FROM THE EXTERNAL FILE -->
          app.loadGenreData(genreJSON, genre_list);

          // EVENT FOR GENRE TEXT ENTRY -->
          genre_define.addEventListener("input", function (event) {
            console.log(genre_define.value);
            let filtered_data = app.filterGenres(genreJSON, genre_define.value);
            console.log(filtered_data);
            // RE LOADS THE GENRES BASED ON FILTERED DATA -->
            app.loadGenreData(filtered_data, genre_list);
          });

          // EVENT FOR CAPTURING GENRE FROM AVAILABLE LIST OF ENTRIES -->
          genre_list.addEventListener("click", function (event) {
            app.user_defined_genre = event.target.innerText;
            console.log(app.user_defined_genre);

            // ADDS THE GENRE WHICH HAS BEEN PROVIDED TO THE CORRECT ARTIST INDEX
            // NOTE> need to make it so that there is a check to see if current iteration occurs on correct artist -->
            app.currently_selected_items[app.artist_genre_index].genres = app.user_defined_genre;
            console.log(app.currently_selected_items);

            // IMPLEMENTED TO INCREASE THE INDEX OF EACH BAND SELECTED WHEN SETTING THE GENRE -->
            app.artist_genre_index++;

            // DISCLOSES THE DYNAMICALLY ADDED TEXT BOX AND LIST OF GENRES -->
            list_information = genre_define.parentNode;
            list_information = genre_list.parentNode;
            list_information.removeChild(genre_define);
            list_information.removeChild(genre_list);
          });
        } else {
          // INDEX OF ARTIST INDEX STILL NEEDS INCREMENTING PER SELECTION -->
          app.artist_genre_index++;
        }

        // RETURNED URL OF ARTIST IMAGE IS RETURNED AND INSERTED INTO COLLATED ARTIST SELECTION -->
        let images = artist.images.map(function (image) {
          return image;
        });

        images.length > 0
          ? (band_image.innerHTML = `<img src="${images[0].url}">`)
          : (band_image.innerHTML = `<img src="https://www.afrocharts.com/images/song_cover-500x500.png">`);

        // CHANGE TEXT OF TEXT BOX TO LIST SELECTION AND DISPLAY BAND IMAGE -->
        text_box.value = artist.name;
        // RESET REMAING INFORMATION TO BE COLLATED AGAIN FOR NEXT ARTIST -->
        suggestion.innerHTML = "";
        did_you_mean.innerHTML = "";
        images = [];
      });
    });
  };

  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  ///                              API CALL FUNCTIONS                              ///
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////

  //
  //
  //
  //
  getRelatedArtists_API = async () => {
    for (let item of app.currently_selected_items) {
      var results = await getRelated(item); // taking array out (like db stuff)
      console.log(results);
      app.addArtistsToDatabaseArr(results.artists);
    }
  };

  //
  //
  //
  //
  getGenres_API = async () => {
    const genre_set_one = app.currently_selected_items[0].genres.split(", ");
    const genre_set_two = app.currently_selected_items[1].genres.split(", ");
    const genre_set_three = app.currently_selected_items[2].genres.split(", ");
    const genre_set = genre_set_one.concat(genre_set_two, genre_set_three);

    // gets the most commonly appearing genre from the genres of each of the artists provided by the user -->
    const hash_genre = app.getMostFrequent(genre_set);

    // RETURNS GENRES
    var results = await getGenres(hash_genre); // taking array out (like db stuff)
    console.log(results);
    app.addArtistsToDatabaseArr(results.artists.items);
  };

  //
  //
  //
  // IMPORTANT> not currently used -->
  // getRecommendedArtists_API = async () => {
  //   for (let item of app.currently_selected_items) {
  //     var results = await getRecommendations(item); // taking array out (like db stuff)
  //     console.log(results);
  //     app.addArtistsToDatabaseArr(results.tracks.artists);
  //   }
  // };

  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  ///                                  FOR TESTING                                 ///
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  // FOR TESTING 3 ARTISTS NAMES -->
  addBandsTesting = async () => {
    // console.log(this.db_information);

    const information_arr = [];

    //
    //
    // -------------------HIGHER POPULAR ARTISTS -->
    information_arr.push({
      name: "Korn",
      genres: "alternative metal, funk metal, nu metal, rap metal, rock",
      id: "3RNrq3jvMZxD9ZyoOZbQOD",
    });
    information_arr.push({ name: "Muse", genres: "modern rock, permanent wave, rock", id: "12Chz98pHFMPJEknJQMWvI" });
    information_arr.push({ name: "U2", genres: "irish rock, permanent wave, rock", id: "51Blml2LZPmy7TTiAg47vQ" });

    app.currently_selected_items = information_arr;

    //
    //
    // -------------------LESSER POPULAR ARTISTS -->
    // information_arr.push({
    //   name: "Bud Sugar",
    //   genres: "hull indie",
    //   id: "2JFYVdU2Sn2TrnJfUeLU6M",
    // });
    // information_arr.push({
    //   name: "Counting Coins",
    //   genres: "dub punk, hull indie, modern ska punk",
    //   id: "4HRH2fh7sgu7nAVpPPwAbT",
    // });
    // information_arr.push({ name: "The Talks", genres: "modern ska punk", id: "3FQYm2hjJbxjAxY5AlGE66" });

    // app.currently_selected_items = information_arr;

    // API CALLS -->
    await app.getRelatedArtists_API();
    await app.getGenres_API();
    // await app.getRecommendedArtists_API(); // IMPORTANT> DO NOT USE (gets tracks not artists)
  };
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  ///                          RECOMMENDATION ENGINE ALGORITHM                     ///
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////

  //
  //
  //
  // Insterts artists into db_information array which is used to generate a DataFrame within the recommendations page.
  // This function mostly is used to manage 'db_information' which is a compilation of all API calls used on 'getRelated()' and 'GetGenres()'
  addArtistsToDatabaseArr = (artists_arr) => {
    artists_arr.forEach(function (item) {
      console.log(item);
      app.db_information.push({
        // for DF use only -->
        item: app.df_item_number,
        // artist_name
        artist: item.name,
        // artist_id
        id: item.id,
        // popularity
        popularity: item.popularity,
        // genres
        genre: item.genres,
        // images
        image: item.images[0],
      });
      app.df_item_number++;
    });
  };

  //
  //
  //
  // Arranges each returned artist into lowest to highest popularity, and returns this list of information then sorted.
  sortAPIArtistDataByPopularity = function (artist_arr) {
    artist_arr.sort(function (a, b) {
      return a.popularity - b.popularity;
    });
  };

  //
  //
  //
  // Performs API from provided id as related artists from given artist -->
  APIIDCall = async (id) => {
    return await getRelatedFromID(id);
  };

  //
  //
  //
  // If returned true, artist id is already contained in the list of artists, otherwise returns false.
  artistExistsInListCheck = function (id) {
    for (let artist of app.less_popular_artists) {
      if (artist.id === id) {
        return true;
      }
    }

    return false;
  };

  //
  //
  //
  // Adds artists which have been ran through conditional checks into collating array for artists which have been discovered through API to be suggested to the user on Recommenadtions page.
  addArtistToLesserPopularArtistList = function (item) {
    app.less_popular_artists.push({
      item: app.df_item_number,
      artist: item.name,
      id: item.id,
      popularity: item.popularity,
      genre: item.genres,
      image: item.images[0],
    });

    // console.log(app.less_popular_artists);
    // console.log("--------ADDED ARTIST TO LESSER POPULAR ARTIST LIST---------");

    app.df_item_number++;
  };

  //
  //
  // NOTE> ONLY USES IN ALGORITHM #2 --> (not currently implemented)
  // Checks whether id has been added or not, adds if not already exisiting with the related artists array.
  additionalIDCollection = function () {
    for (let item of app.recommendation_result.artists) {
      if (!app.API_related_artists.includes(item.id)) {
        app.API_related_artists.push(item);
      }
    }

    // sorts before terminating -->
    this.sortAPIArtistDataByPopularity(app.API_related_artists);
  };

  //
  //
  //
  //
  // Algorithm for providing recommendations.
  // NOTE> Could maybe be optimized to use genre as a foundation to find more relatable recommendations to the ones which have geen searched for?
  artistPopularityArrangement = async () => {
    // collects ids which have appeared throughout API searches -->
    let API_called_ids = [];

    // Sets the length of how many artists to add to end result -->
    const less_popular_artists_desired_length = 400;
    // iterates the amount of ocassions results were not found on API artist id (used for guard clause) -->
    let loops_without_results = 0;
    // checks ids without information which cannot be formulated (upto this amount) -->
    const max_searches_before_break = 10;
    // defines the minimum popularity to add lesser popular artists on -->
    const popularity_search_caviate = 35;

    // NOTE> on my popular search of artists that could be found (Taylor Swift, Drake, Rihanna) there are two artists that get returned here - Selena Gomez & Tianchi
    console.log(app.less_popular_artists);

    // sorting returned least popular artists from less_popular_artists -->
    this.sortAPIArtistDataByPopularity(app.less_popular_artists);

    // returns a list of 20 artists based on a single least popular id from less_popular_artists (THE LEAST POPULAR ARTIST FROM WHAT HAS BEEN DISCOVERED SO FAR) -->
    app.recommendation_result = await app.APIIDCall(app.less_popular_artists[0].id);

    // reset less popular artists to empty -->
    app.less_popular_artists = [];

    // sorting returned least popular artists from recommendation_result APIIDCall -->
    this.sortAPIArtistDataByPopularity(app.recommendation_result.artists);

    // adds into API_related_artists -->
    // app.less_popular_artists.forEach(function (item) {
    //   app.API_related_artists.push(item);
    // });

    // only runs if recommendation_result is not empty, hence only when data has been retrieved from the current API call on the existing least popular artist discovered.
    // Guard clauses in place to stop over looping -->
    if (
      app.recommendation_result.length !== 0 &&
      app.less_popular_artists.length < less_popular_artists_desired_length
    ) {
      while (
        // runs until conditions are met -->
        app.less_popular_artists.length !== less_popular_artists_desired_length &&
        loops_without_results !== max_searches_before_break
      ) {
        // for guard clause at the bottom of this function -->
        let start_length = app.less_popular_artists.length;

        // will run until conditionals and caviate of popularity is no longer met (from low to high)
        for (let artist of app.recommendation_result.artists) {
          if (!this.artistExistsInListCheck(artist.id) && artist.popularity <= popularity_search_caviate) {
            if (app.less_popular_artists.length !== less_popular_artists_desired_length) {
              // pushes in required information for iterative artist -->
              app.addArtistToLesserPopularArtistList(artist);

              // resets as results have currently been added -->
              loops_without_results = 0;

              // console.log(`ADDING ARTIST ${artist.name}`);
            } else {
              // break back to the for loop for to iterate over the next artist -->
              break; // shows where it breaks from!
            }
          }
        }

        // NOTE> METHOD #1
        // Utalises only the least popular returned aritst for chaining once no more artists meet the caviate of minimum popularity desire..
        // This happens in cases where the popularity has not met the less_popular_artist_desired length also.
        // A new API is defined here building up that least popular artist from the previous search (creating a chain effect from most to least popular dynamically) -->
        if (app.less_popular_artists.length !== less_popular_artists_desired_length) {
          for (let item of app.recommendation_result.artists) {
            if (!API_called_ids.includes(item.id)) {
              API_called_ids.push(item.id);
              // console.log(`API CALLED ID's length: ${API_called_ids.length}`);
              app.recommendation_result = await this.APIIDCall(item.id);

              // console.log(app.recommendation_result);

              // stops broken checks..... (guard clause) as it will re loop around to one of the remaining artists in the list
              // FOR CASES WHERE API CALL RETRIEVED NO INFORMATION -->
              if (app.recommendation_result.artists.length === 0) {
                continue;
              }

              this.sortAPIArtistDataByPopularity(app.recommendation_result.artists);
              // console.log(`# of items returned from API call: length: ${app.recommendation_result.artists.length}`);

              // breaks back to the while loop -->
              break;
            }
          }
        }
        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////

        // NOTE> METHOD #2 -- BUG> Does not work correctly on lesser popular artists
        // Utalises every returned aritst for chaining -->

        // && app.less_popular_artists.length <= less_popular_artists_desired_length
        // if (app.less_popular_artists.length !== less_popular_artists_desired_length) {
        //   console.log(app.API_related_artists);
        //   for (let item of app.API_related_artists) {
        //     // adds if not already contained in list -->
        //     if (!API_called_ids.includes(item.id)) {
        //       API_called_ids.push(item.id);
        //       console.log(API_called_ids);

        //       // colates additional artist
        //       app.additionalIDCollection();

        //       console.log(`API CALLED ID's length: ${API_called_ids.length}`);

        //       // chain another API call using the id of the specific item's id -->
        //       app.recommendation_result = await this.APIIDCall(item.id);

        //       // guard clause, stops API calls which have returned no data so returns more artists -->
        //       if (app.recommendation_result.artists.length === 0) {
        //         //continues back to for loop for every item -->
        //         continue;
        //       }

        //       // this.sortLists(app.recommendation_result.artists);
        //       console.log(`RRA: length: ${app.recommendation_result.artists.length}`);
        //       break;
        //     }
        //   }
        // }

        /////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////

        // iteration where nothing was found (runs a maximum of times without breaking). Consecutive fails! -->
        const end_length = app.less_popular_artists.length;
        if (start_length === end_length) {
          loops_without_results++;
        }

        // console.log(app.less_popular_artists.length);
      }
      // console.log(loops_without_results === max_searches_before_break ? "MAXIMUM FOUND" : "FINISHED SEARCHING!");
      // console.log(app.less_popular_artists.length);
      // console.log(app.API_related_artists);
    }
  };

  getReturnedParamsFromSpotifyAuth = (url) => {
    // http://localhost:8000/#access_token=BQD3PdCFe2q33l6GoAD4kVSdnfX-vAV8hZTXwmc2Skzwu_wqHMmop6YN94I5i8320xxJOVIeZ6YujDTGvx-7VW_0rua1N7zaK0PNsUG-aEyJFBKHnn53wb84wzwwZRO2daLwawvz-KQ-GUVhOrAtfNuaRLVXFtkZKFO6554FSzMiGsOL4xjh3ENhTgYlDK882XeWmU4z0avTsDaVEcZL8eQIEbI3&token_type=Bearer&expires_in=3600
    const string_after_hash = url.substring(1);
    const params_in_url = string_after_hash.split("&");

    const params_split = params_in_url.reduce(function (acc, current) {
      // console.log(current);
      const [key, val] = current.split("=");
      acc[key] = val;
      return acc;
    }, {});

    // runs if user is logged in, otherwise object is empty, do not need to save to local storage -->
    if (JSON.stringify(params_split) !== {}) {
      window.localStorage.setItem("accessToken", params_split.access_token);
      window.localStorage.setItem("expiresIn", params_split.expires_in);
      window.localStorage.setItem("tokenType", params_split.token_type);
    }

    // return params_split;
  };
}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////                      User Input Text Field Capture                        /////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

//
//
//
//
const captureOne = async (event) => {
  // PREVENTS FURTHER INFORMATION BEEN PROVIDED IN THIS TEXT FIELD -->
  app.event_one_captured = true;

  // CAPTURES AND FORMATS SPECIFIED ARTIST NAME -->
  try {
    app.artist_name = document.getElementById("entry1").value.trim();
    let artist = app.formatArtistName(app.artist_name);

    // AWAITS THE ARTIST DATA TO BE RETURNED FROM SPOTIFY API CALL -->
    const data = await getArtist(artist);
    console.log(data);

    // PROVIDES COLLATED LIST OF ARTISTS RELEVANT TO SPCIFIED SEARCH CRITERIA -->
    // NOTE> Need a better styled way of doing this -->
    const message = `Did you mean:`;
    did_you_mean_message_text.insertAdjacentHTML("beforeend", message);
    app.listEntries(data, first_textbox, band_image_1, suggestion_1, did_you_mean_message_text);
    // using 'app' as the eventListener is the closest 'this' (could use .bind())
  } catch (err) {
    console.log(`${err}: occured...`);
  }
};

//
//
//
//
const captureTwo = async (event) => {
  // use try catch!
  // NOTE> MAY NEED TO CHECK WHETHER A GENRE HAS BEEN SPECIFIED IF REQUIRED FROM PREVIOUS SELECTION
  app.event_two_captured = true;

  app.artist_name = document.getElementById("entry2").value.trim();
  let artist = app.formatArtistName(app.artist_name);

  const data = await getArtist(artist);
  console.log(data);

  const message = `Did you mean:`;
  did_you_mean_message_text.insertAdjacentHTML("beforeend", message);
  app.listEntries(data, second_textbox, band_image_2, suggestion_2, did_you_mean_message_text);
};

//
//
//
//
const captureThree = async (event) => {
  // use try catch!
  // NOTE> MAY NEED TO CHECK WHETHER A GENRE HAS BEEN SPECIFIED IF REQUIRED FROM PREVIOUS SELECTION
  app.event_three_captured = true;

  app.artist_name = document.getElementById("entry3").value.trim();
  let artist = app.formatArtistName(app.artist_name);

  const data = await getArtist(artist);
  console.log(data);

  const message = `Did you mean:`;
  did_you_mean_message_text.insertAdjacentHTML("beforeend", message);
  app.listEntries(data, third_textbox, band_image_3, suggestion_3, did_you_mean_message_text);
};

//
//
// EVENT FOR FIRST TEXT FIELD ENTRY -->
if (first_textbox) {
  first_textbox.addEventListener("keydown", (event) => {
    if (event.keyCode == 13 || event.keyCode == 9) captureOne(), { once: true };
  });
}

//
//
// EVENT FOR SECOND TEXT FIELD ENTRY -->
if (second_textbox) {
  // second_textbox.addEventListener("keydown", (event) => captureTwo(event));
  second_textbox.addEventListener("keydown", (event) => {
    if (event.keyCode == 13 || event.keyCode == 9) captureTwo(), { once: true };
  });
}

//
//
// EVENT FOR THIRD TEXT FIELD ENTRY -->
if (third_textbox) {
  third_textbox.addEventListener("keydown", (event) => {
    if (event.keyCode == 13 || event.keyCode == 9) captureThree(), { once: true };
  });
}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////                 User Input Recommendations Button Press                   /////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

if (get_recommendations_button) {
  get_recommendations_button.addEventListener("click", async (event) => {
    //////////////////////////////////////////////////////////////////////////////////
    // NOTE> FOR TESTING PURPOSES -->
    // await app.addBandsTesting();
    //////////////////////////////////////////////////////////////////////////////////

    console.log(app.currently_selected_items);

    const required_artist_amount = 3;
    const minimum_required_retrieval_artist_amount = 1;

    // NOTE> WANT TO HAVE IT WHERE IT PROGRESSIVELY GETS HIGHER ON THE POPULARITY CUT OFF
    // Beyonce, Jay-Z, 2Pac is - minimum 51 popularity when sorted
    // The Weekend, Miley Cyrus, Eminem - min 59 Hilary Duff popularity when sorted
    // Shakira, Ed Sheran, Sam Smith - Cosmo Sheldrake 57 min
    // David Guetta, Drake, Rihanna - Cash Cash 65 min
    // Taylor Swift, Drake, Rihanna, - Selena Gomez and the scene 70 min
    let popularity_cut_off = 50;
    let popularity_metric_increase = 5;

    try {
      // NOTE> ANNIMATION for search_button loading.
      // searches for any div which is contained within the search_button id -->
      const loading_annimation = document.querySelector("#search_button div");
      loading_annimation.classList.toggle("loading");

      while (app.less_popular_artists < minimum_required_retrieval_artist_amount) {
        if (app.currently_selected_items.length === required_artist_amount) {
          // NOTE> FOR NORMAL USER INPUT -->
          await app.getRelatedArtists_API();
          await app.getGenres_API();
          // await app.getRecommendedArtists_API(); // IMPORTANT> do not use!

          app.sortAPIArtistDataByPopularity(app.db_information);
          console.log(app.db_information);

          // takes artists with a popularity of less than or equal to 50 to then do chaining methods on in an attempt to generate lesser popular artists for suggestion -->

          app.less_popular_artists = app.db_information.filter(function (artist) {
            return artist.popularity <= popularity_cut_off;
          });

          // will casue while loop to run until at least one artist is returned with desired minimum popularity -->
          if (app.less_popular_artists.length === 0) {
            popularity_cut_off += popularity_metric_increase;
          } else {
            // IMPORTANT NOTE> COULD BE 0!
            // NEED TO IMPLEMENT SOMETHING WHICH HANDLES THE CASE WHERE NO LESSER POPULAR ARTISTS ARE BROUGHT BACK

            // NOTE> IS A COPY OF ALL DB GATHER INFORMATION (from the API calls) and is then processed to only allow A CERTAIN METRIC OFF POPULAIRTY through.
            console.log(app.less_popular_artists);

            // get_recommendations_button.removeEventListener("click", onclick());

            // Generates lesser popular artists -->
            await app.artistPopularityArrangement();

            const url_redirect = resetURLAddress();

            console.log(app.less_popular_artists);
            // saves to local storage to allow usage of collated array on Recommendations page -->
            location.href = `${url_redirect}recommendation_page/recommendation.html`;
            window.localStorage.setItem("cross-page_df", JSON.stringify(app.less_popular_artists));
          }
        } else {
          // NOTE> Need a better styling method -->
          user_message.innerHTML = `<h1>Were 3 artists provided?</h1>`;
          setTimeout(() => {
            user_message.innerHTML = "";
          }, "2000");

          break;
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////                         Spotify Log in Functionality                      /////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// ALREADY DECLARED (kept for testing sakes)
//
//
//
// const getReturnedParamsFromSpotifyAuth = (hash) => {
//   // http://localhost:8000/#access_token=BQD3PdCFe2q33l6GoAD4kVSdnfX-vAV8hZTXwmc2Skzwu_wqHMmop6YN94I5i8320xxJOVIeZ6YujDTGvx-7VW_0rua1N7zaK0PNsUG-aEyJFBKHnn53wb84wzwwZRO2daLwawvz-KQ-GUVhOrAtfNuaRLVXFtkZKFO6554FSzMiGsOL4xjh3ENhTgYlDK882XeWmU4z0avTsDaVEcZL8eQIEbI3&token_type=Bearer&expires_in=3600
//   const string_after_hash = hash.substring(1);
//   const params_in_url = string_after_hash.split("&");

//   const params_split = params_in_url.reduce(function (acc, current) {
//     // console.log(current);
//     const [key, val] = current.split("=");
//     acc[key] = val;
//     return acc;
//   }, {});

//   return params_split;
// };

////////////////////////////////////////////////////////////////////////////

const app = new App(); // intializes the class to be ran (REACT approach)

home_text.addEventListener("click", function () {
  if (localStorage.getItem("loggedInState") === "true") {
    const redirect_URL_with_login_session = `${window.location.origin}/#access_token=${localStorage.getItem(
      "accessToken"
    )}&token_type=${localStorage.getItem("tokenType")}&expires_in=${localStorage.getItem("expiresIn")}`;
    console.log(redirect_URL_with_login_session);

    window.location.href = redirect_URL_with_login_session;
  } else {
    // NOTE> does anything else need doing?
    window.location.href = window.location.origin;
  }
});

log_in_to_spotify.addEventListener("click", async () => {
  // if not currently logged in -->
  if (localStorage.getItem("loggedInState") === null) {
    app.logged_in = true;

    // save log in state to local storage -->
    window.localStorage.setItem("loggedInState", app.logged_in);
    getAuthPerUserLogin();
  } else if (localStorage.getItem("loggedInState") === "true") {
    app.logged_in = false;

    window.localStorage.clear();
    console.log(window.location.origin);
    window.location.href = window.location.origin;
  }
});

// returns information back from logged in state set by the returned URL params from single page sign in
if (localStorage.getItem("loggedInState") === "true") {
  // returns after hash symbol -->
  app.getReturnedParamsFromSpotifyAuth(window.location.hash);

  // change the text of the log in button to suit the current state of user log in options -->
  const log_in = document.getElementById("log_in_spotify");
  log_in.innerText = "Log Out of Spotify";
}

//
//
//
// const storedAccessToken = function () {
//   const access_token = localStorage.getItem("accessToken");
//   console.log(access_token);
// };
// if (localStorage.getItem("accessToken")) {
//   storedAccessToken();
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const setAccessToken = function () {
  app.session_access_token = localStorage.getItem("accessToken");

  if (localStorage.getItem("loggedInState")) {
    app.logged_in = localStorage.getItem("loggedInState");
  } else {
    app.logged_in = "false";
  }

  console.log(app.logged_in);

  // post collected user session accessToken to server (for unit testing) -->
  axios.post("http://localhost:8000/set_session_token", {
    // will be false if nothing in local storage though/not clicked 'log_in' ... -->
    loggedInState: app.logged_in,
    token: app.session_access_token,
  });
};
setAccessToken();
// if (localStorage.getItem("accessToken")) {
//   console.log("running setAccessToken");
//   setAccessToken();
// }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//
//
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////                               Notes Section                               /////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//
// 20/01/23 NOTE -->
// Good idea to add a loading page in between script.js and recommendation.js files

//
//
// So now I am going to need to load the content through the DF and load this
//  data onto the next page (Recommendations Page transition) similar to how the
// artists are dynamically created when searching for bands on the landing page.

// NOTE> PRIMARY OBJECTIVES STILL TO IMPLEMENT -->
// RECOMMENDATIONS >>>
// Decision Tree (based on popularity)
// Lower popularity artists to recommended per search

// ACESSIBILITY >>>
// Single page log-in
// allow a user to have their most previous genre search items saved to their token

// The way that the API searches currently work is -
// The higher the popularity of the artist been searched for == the less likely less popular artists are returned
// Meaning :- if the user searches for less popular artists (the talks) off the bat, then they will automatically be returned less popular artists based on that artists
// SO
// it could be done where (if - artist been searched for is popularity > ~50)
//(then - take artists less popular API returns and do a search based on them)?
// Ideally looking for a 70/30 - 80/20 split of less popular(70-80) vs. most popular(20-30)
