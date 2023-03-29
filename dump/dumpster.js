// export function exp = async () => {
//   let obj = await app.related_recommended_genre_set;
//   return obj;
// };

///--------------------------------------------------------------------------------
///-                               EVENT LISTENERS                                -
///--------------------------------------------------------------------------------

//
//
// EVENT FOR FIRST TEXT FIELD ENTRY -->
//   user_input_1 = first_textbox.addEventListener("keydown", async (event) => {
//     console.log("ran");
//     if (
//       (event.key === "Enter" && this.event_one_captured === false) ||
//       (event.key === "Tab" && this.event_one_captured === false)
//     ) {
//       // PREVENTS FURTHER INFORMATION BEEN PROVIDED IN THIS TEXT FIELD -->
//       this.event_one_captured = true;

//       // CAPTURES AND FORMATS SPECIFIED ARTIST NAME -->
//       this.artist_name = document.getElementById("entry1").value.trim();
//       let artist = this.formatArtistName(this.artist_name);

//       // AWAITS THE ARTIST DATA TO BE RETURNED FROM SPOTIFY API CALL -->
//       const data = await getArtist(artist, this);
//       console.log(data);

//       // PROVIDES COLLATED LIST OF ARTISTS RELEVANT TO SPCIFIED SEARCH CRITERIA -->
//       const message = `Did you mean:`;
//       did_you_mean_message_text.insertAdjacentHTML("beforeend", message);
//       app.listEntries(data, first_textbox, band_image_1, suggestion_1, did_you_mean_message_text);
//       // using 'app' as the eventListener is the closest 'this' (could use .bind())
//     }
//   });

//   //
//   //
//   // EVENT FOR SECOND TEXT FIELD ENTRY -->
//   user_input_2 = second_textbox.addEventListener("keydown", async (event) => {
//     if (
//       (event.key === "Enter" && this.event_two_captured === false) ||
//       (event.key === "Tab" && this.event_two_captured === false)
//     ) {
//       this.event_two_captured = true;

//       this.artist_name = document.getElementById("entry2").value.trim();
//       let artist = this.formatArtistName(this.artist_name);

//       const data = await getArtist(artist, this);
//       console.log(data);

//       const message = `Did you mean:`;
//       did_you_mean_message_text.insertAdjacentHTML("beforeend", message);
//       app.listEntries(data, second_textbox, band_image_2, suggestion_2, did_you_mean_message_text);
//     }
//   });

//   //
//   //
//   // EVENT FOR THIRD TEXT FIELD ENTRY -->
//   user_input_3 = third_textbox.addEventListener("keydown", async (event) => {
//     if (
//       (event.key === "Enter" && this.event_three_captured === false) ||
//       (event.key === "Tab" && this.event_three_captured === false)
//     ) {
//       this.event_three_captured = true;

//       this.artist_name = document.getElementById("entry3").value.trim();
//       let artist = this.formatArtistName(this.artist_name);

//       const data = await getArtist(artist, this);
//       console.log(data);

//       const message = `Did you mean:`;
//       did_you_mean_message_text.insertAdjacentHTML("beforeend", message);
//       await app.listEntries(data, third_textbox, band_image_3, suggestion_3, did_you_mean_message_text);
//     }
//   });

//   // Event for building recommendation object which is required by Spotify API data.
//   // Collects all the artist information to this point.
//   // -------------------------------------------------------------------------------
//   recommendations = get_recommendations_button.addEventListener("click", async (event) => {
//     console.log(app.currently_selected_items);

//     try {
//       // RETURNS 3 SETS OF RELATED ARTISTS PER ARTIST PROVIDED BY THE USER -->
//       app.related_artists_set_one = await getRelated(app.currently_selected_items[0]);
//       app.related_artists_set_two = await getRelated(app.currently_selected_items[1]);
//       app.related_artists_set_three = await getRelated(app.currently_selected_items[2]);

//       app.related_recommended_genre_set.push(
//         app.related_artists_set_one.artists,
//         app.related_artists_set_two.artists,
//         app.related_artists_set_three.artists
//       );
//       // SETTING UP 'getRelated' FOR DATAFRAME -->
//       for (let ind of app.related_recommended_genre_set) {
//         for (let item of ind) {
//           app.db_information.push([app.df_item_number, item.name, item.popularity]);
//           app.df_item_number++;
//         }
//       }

//       //
//       //
//       // RETURNS A SIGNLE SET OF RELATED ARTISTS SPECIFIC TO A DERIVED GENRE FROM THE 3 ARTISTS PROVIDED -->
//       const genre_set_one = app.currently_selected_items[0].genres.split(", ");
//       const genre_set_two = app.currently_selected_items[1].genres.split(", ");
//       const genre_set_three = app.currently_selected_items[2].genres.split(", ");
//       const genre_set = genre_set_one.concat(genre_set_two, genre_set_three);
//       console.log(genre_set);
//       const hash_genre = this.getMostFrequent(genre_set);
//       console.log(hash_genre);
//       // RETURNS GENRES
//       app.related_by_genre = await getGenres(hash_genre);
//       app.related_recommended_genre_set.push(app.related_by_genre.artists.items);
//       // SETTING UP 'getGenres' FOR DATAFRAME -->
//       for (let ind of app.related_recommended_genre_set) {
//         for (let item of ind) {
//           app.db_information.push([app.df_item_number, item.name, item.popularity]);
//           app.df_item_number++;
//         }
//       }

//       //
//       //
//       // RETURNS 3 SETS OF RECOMMENDATIONS ACHNOWLEDGED BY SPOTIFY AS RELATED ARTISTS TO THE ONES WHICH THE USER HAS SPECIFIED -->
//       app.recommended_artists_set_one = await getRecommendations(app.currently_selected_items[0].id);
//       app.recommended_artists_set_two = await getRecommendations(app.currently_selected_items[1].id);
//       app.recommended_artists_set_three = await getRecommendations(app.currently_selected_items[2].id);

//       app.recommended_set.push(
//         app.recommended_artists_set_one.tracks,
//         app.recommended_artists_set_two.tracks,
//         app.recommended_artists_set_three.tracks
//       );
//       // SETTING UP 'getGenres' FOR DATAFRAME -->
//       for (let ind of app.recommended_set) {
//         for (let item of ind) {
//           app.db_information.push([app.df_item_number, item.artists[0].name, item.popularity]);
//           app.df_item_number++;
//         }
//       }

//       // 1. GetRelated (1, 2, 3)
//       // 2. GetGenres (4)                     (same object format as GetRelated)
//       // 3. GetRecommendations (5, 6, 7)      (different object format)
//       // Dataframe workings -->
//       // const dm = new DataminingHandler();
//       // dm.newDF(app.db_information);
//       location.href = `${window.location.href}recommendation_page/recommendation.html`;
//       ///
//     } catch (err) {
//       console.error(err);
//       console.log(`Were 3 artists provided?`);
//       user_message.insertAdjacentHTML("beforeend", `Were 3 artists provided?`);
//       const timeout = setTimeout(() => {
//         user_message.innerHTML = "";
//       }, "3000");
//     }
//   });
// }
// }

//
///
////
/////
/////
/////
////
///
//

// // RETURNS 3 SETS OF RELATED ARTISTS PER ARTIST PROVIDED BY THE USER (sets of 20) -->
// app.related_artists_set_one = await getRelated(app.currently_selected_items[0]);
// app.related_artists_set_two = await getRelated(app.currently_selected_items[1]);
// app.related_artists_set_three = await getRelated(app.currently_selected_items[2]);

// app.get_related_set.push(
//   app.related_artists_set_one.artists,
//   app.related_artists_set_two.artists,
//   app.related_artists_set_three.artists
// );
// console.log(app.get_genre_set);

// // SETTING UP 'getRelated' FOR DATAFRAME -->
// for (let ind of app.get_related_set) {
//   for (let item of ind) {
//     // console.log(item);
//     app.db_information.push({
//       item: app.df_item_number,
//       artist: item.name,
//       id: item.id,
//       popularity: item.popularity,
//     });
//     app.df_item_number++;
//   }
// }

// RETURNS 3 SETS OF RELATED ARTISTS PER ARTIST PROVIDED BY THE USER (sets of 20) -->

// console.log(app.db_information);
// console.log(app.currently_selected_items);
// app.related_artists_set_one = await getRelated(app.currently_selected_items[0]);
// app.related_artists_set_two = await getRelated(app.currently_selected_items[1]);
// app.related_artists_set_three = await getRelated(app.currently_selected_items[2]);

// app.get_related_set.push(
//   app.related_artists_set_one.artists,
//   app.related_artists_set_two.artists,
//   app.related_artists_set_three.artists
// );
// console.log(app.get_genre_set);

// // SETTING UP 'getRelated' FOR DATAFRAME -->
// for (let ind of app.get_related_set) {
//   for (let item of ind) {
//     // console.log(item);
//     app.db_information.push({
//       item: app.df_item_number,
//       artist: item.name,
//       id: item.id,
//       popularity: item.popularity,
//     });
//     app.df_item_number++;
//   }
// }

//
//
// RETURNS A SINGLE SET OF RELATED ARTISTS SPECIFIC TO A DERIVED GENRE FROM THE 3 ARTISTS PROVIDED (set of 50)-->
// const genre_set_one = app.currently_selected_items[0].genres.split(", ");
// const genre_set_two = app.currently_selected_items[1].genres.split(", ");
// const genre_set_three = app.currently_selected_items[2].genres.split(", ");
// const genre_set = genre_set_one.concat(genre_set_two, genre_set_three);
// console.log(genre_set);
// const hash_genre = app.getMostFrequent(genre_set);
// console.log(hash_genre);
// // RETURNS GENRES
// app.related_by_genre = await getGenres(hash_genre);
// app.get_genre_set.push(app.related_by_genre.artists.items);
// console.log(app.get_genre_set);

// // SETTING UP 'getGenres' FOR DATAFRAME -->
// for (let ind of app.get_genre_set) {
//   for (let item of ind) {
//     app.db_information.push({
//       item: app.df_item_number,
//       artist: item.name,
//       id: item.id,
//       popularity: item.popularity,
//     });
//     app.df_item_number++;
//   }
// }

//
//
// RETURNS 3 SETS OF RECOMMENDATIONS ACHNOWLEDGED BY SPOTIFY AS RELATED ARTISTS TO THE ONES WHICH THE USER HAS SPECIFIED (sets of 50) -->
// app.recommended_artists_set_one = await getRecommendations(app.currently_selected_items[0].id);
// app.recommended_artists_set_two = await getRecommendations(app.currently_selected_items[1].id);
// app.recommended_artists_set_three = await getRecommendations(app.currently_selected_items[2].id);

// app.get_recommendations_set.push(
//   app.recommended_artists_set_one.tracks,
//   app.recommended_artists_set_two.tracks,
//   app.recommended_artists_set_three.tracks
// );
// console.log(app.get_recommendations_set);

// // SETTING UP 'getGenres' FOR DATAFRAME -->
// for (let ind of app.get_recommendations_set) {
//   console.log(ind);
//   for (let item of ind) {
//     app.db_information.push({
//       item: app.df_item_number,
//       artist: item.artists[0].name,
//       id: item.artists[0].id,
//       popularity: item.popularity,
//     });
//     app.df_item_number++;
//   }
// }

//
///
////
/////
/////
/////
////
///
//
//

// from the list of 20 artists returned -->
// app.recommendation_result.forEach(
//   async (recommended_artists, ind) => {
//     // sort through them into lowest -> highest popularity -->
//     recommended_artists.artists.sort(function (a, b) {
//       return a.popularity - b.popularity;
//     });
//     console.log(app.recommendation_result);
//   },

//   //
//   //
//   //
//   // Takes lesser popular artists (defined by threshold = ~25) and completes additional API calls to attempt to generate a greater amount of lesser popular artists to be used and provided to the user.
//   // Uses the lowest popularity instance to generate the artist id to develop this search on.
//   (getLesserPopularArtists = async () => {
//     // app.less_popular_artists.sort(function (a, b) {
//     //   return a.popularity - b.popularity;
//     // });
//     // console.log(app.less_popular_artists);
//     // // get each lesser_popular_artists artists ID -->
//     // let artist_id = app.less_popular_artists[0].id;
//     // console.log(artist_id);
//     // console.log(app.recommendation_result);
//     // // generate a list of 20 artists from the lesser popular artist -->
//     // app.recommendation_result.push(await getRelatedFromID(artist_id));
//     // console.log(app.recommendation_result);
//     // // from the list of 20 artists returned -->
//     // app.recommendation_result.forEach(async (recommended_artists, ind) => {
//     //   // sort through them into lowest -> highest popularity -->
//     //   recommended_artists.artists.sort(function (a, b) {
//     //     return a.popularity - b.popularity;
//     //   });
//     //   console.log(app.recommendation_result);
//     // // does conditional check to allow newly found artist to be added based on criteria -->
//     // app.AddNewLesserPopularArtists(...app.recommendation_result);
//   })
// );

// // SEARCHING AGAIN BECAUSE ITS NOT LOW ENOUGH -->
// if (!app.recommendation_result[0].artists[0].popularity < 25) {
//   console.log(app.recommendation_result);
//   let first_artist_id = app.recommendation_result[0].artists[0].id;

//   app.recommendation_result.splice(0, 1);
//   console.log(app.recommendation_result);

//   // // generate a list of 20 artists from the lesser popular artist -->
//   // app.recommendation_result.push(await getRelatedFromID(first_artist_id));
//   // console.log(app.recommendation_result);

//   if (app.less_popular_artists.length <= 15) {
//     await this.getLesserPopularArtistsRecursion(first_artist_id);
//   }
//   // app.recommendation_result.push(await this.getLesserPopularArtistsRecursion(first_artist_id));
//   // app.recommendation_result.splice(0, 1); //<
// }
// };

//   getLesserPopularArtistsRecursion = async (artist_id) => {
//     // generate a list of 20 artists from the lesser popular artist -->
//     app.recommendation_result.push(await getRelatedFromID(artist_id));
//     console.log(app.recommendation_result);

//     // from the list of 20 artists returned -->
//     app.recommendation_result.forEach(async (recommended_artists, ind) => {
//       // sort through them into lowest -> highest popularity -->
//       recommended_artists.artists.sort(function (a, b) {
//         return a.popularity - b.popularity;
//       });
//       console.log(app.recommendation_result);
//     });

//     if (app.recommendation_result[0].artists[0].popularity > 25) {
//       console.log(app.recommendation_result);
//       let first_artist_id = app.recommendation_result[0].artists[0].id;
//       app.recommendation_result.push(await this.getLesserPopularArtistsRecursion(first_artist_id));
//       app.recommendation_result.splice(0, 1); //<
//       console.log(app.recommendation_result);
//     } else {
//       // app.addArtistsToDatabase()
//       // // does conditional check to allow newly found artist to be added based on criteria -->
//       app.AddNewLesserPopularArtists(...app.recommendation_result);
//     }

//     if (app.less_popular_artists.length <= 15) {
//       let next_artist_id = app.recommendation_result[0].artists[0].id;
//       console.log(next_artist_id);
//       // app.recommendation_result.splice(0, 1); //<
//       await this.getLesserPopularArtistsRecursion(next_artist_id);
//     }
//   };

//   //
//   //
//   //
//   // Adds new artists which have been discovered through the lesser popular artists given then meet the critera to do so (less than 50 popularity and not already within the currently gathered information/data)
//   AddNewLesserPopularArtists = (recommendation_result) => {
//     console.log(recommendation_result);
//     console.log(app.less_popular_artists);
//     // let entries = Object.entries(app.less_popular_artists);
//     // let data = entries.map([key, val] entry {
//     //   return val;
//     // })

//     let artist_ids = [];
//     for (let [key, val] of Object.entries(app.less_popular_artists)) {
//       console.log(val);
//       artist_ids.push(val.id);
//     }
//     console.log(artist_ids);

//     recommendation_result.forEach(function (item) {
//       if (
//         // NEED A WAY TO CHECK IF THE ID IS ALREADY INCLUDED (as object notation) -->
//         !artist_ids.includes(item.id) &&
//         item.popularity < 25
//       ) {
//         app.less_popular_artists.push({
//           item: app.df_item_number,
//           artist: item.name,
//           id: item.id,
//           popularity: item.popularity,
//         });
//         console.log(app.less_popular_artists);

//         app.df_item_number++;
//       }
//     });

//     // recommendation_result.artists.splice(0, 1);
//     console.log(recommendation_result);

//     // else if its the top (after been stripped out) < 25 && not not already in / then add
//   };
// }

//
///
////
/////
/////
/////
////
///
//

// if (get_recommendations_button) {
//   get_recommendations_button.addEventListener("click", async (event) => {
//     console.log(app.currently_selected_items);
//     // TO LINK TO NEXT 'Recommendation' PAGE -->

//     try {
//       await app.addBandsTesting();
//       // await app.getRelatedArtists_API();
//       // await app.getGenres_API();
//       // await app.getRecommendedArtists_API(); // IMPORTANT> do not use

//       await app.recommendOutputList();
//       console.log(app.db_information);
//       console.log(app.recommendation_result);
//       console.log(app.less_popular_artists);

//       //
//       //
//       ////////////////////////////////
//       // IF USER SEARCH RETURNS LESS POPULAR BANDS ALREADY THEN DONT NEED TO DO THIS -->
//       // IMPORTANT NOTE> so check the number of lesser popularity artists which have been returned FIRST!!!
//       // returning artists from collated artists which are less than ~26 popularity aiming to derive a search of these to find more lesser popularity artists -->
//       app.less_popular_artists = app.db_information.filter(function (artist) {
//         console.log(artist);
//         return artist.popularity <= 50;
//       });
//       console.log(app.less_popular_artists);

//       if (app.less_popular_artists.length <= 15) {
//         await app.getLesserPopularArtists();
//       }

//       app.db_information.push(...app.less_popular_artists);

//       console.log(app.db_information);
//       console.log(app.recommendation_result);
//       console.log(app.less_popular_artists);
//       ///////////////////////////////
//       //
//       //

//       // 1. GetRelated (1, 2, 3)
//       // 2. GetGenres (4)                     (same object format as GetRelated)
//       // 3. GetRecommendations (5, 6, 7)      (different object format)

//       // Saving data to local storage to be pulled on recommendation page
//       // This has to be done as the stack is cleared once new pages is loaded -->

//       // NOTE> make sure to check that all boxes are filled in -->
//       // could make another button to work the automated stuff

//       console.log("Saving to local storage");
//       console.log(app.recommendation_output_list);

//       location.href = `${window.location.href}recommendation_page/recommendation.html`;
//       window.localStorage.setItem("cross-page_df", JSON.stringify(app.recommendation_output_list));
//     } catch (err) {
//       console.error(err);
//       console.log(`Were 3 artists provided?`);
//       user_message.insertAdjacentHTML("beforeend", `Were 3 artists provided?`);
//       const timeout = setTimeout(() => {
//         user_message.innerHTML = "";
//       }, "3000");
//     }
//   });
// }

//
///
////
/////
/////
/////
/////
////
///
//
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//
//
//
//
// recommendOutputList = () => {
//   let popularity_counter = 10;
//   const number_of_recommendations = 20;

//   console.log(app.db_information);

//   while (app.recommendation_output_list.length !== number_of_recommendations) {
//     for (let i = 0; i < app.db_information.length; i++) {
//       console.log(this.db_information);
//       if (app.recommendation_output_list.length === number_of_recommendations) {
//         break;
//       } else if (app.db_information[i].popularity <= popularity_counter) {
//         if (!app.recommendation_output_list.includes(app.db_information[i])) {
//           app.recommendation_output_list.push(app.db_information[i]);
//         }
//       }
//     }

//     popularity_counter += 2;
//   }
// };

//
//
//
// NOTE> Is this needed?????
// APICallSort = async () => {
//   this.sortAPIArtistDataByPopularity(app.less_popular_artists);

//   // get each lesser_popular_artists artists ID -->
//   let artist_id = app.less_popular_artists[0].id;

//   // generate a list of 20 artists from the lesser popular artist -->
//   app.recommendation_result = await this.APIIDCall();
//   console.log(app.recommendation_result);

//   this.sortAPIArtistDataByPopularity(app.recommendation_result);
//   console.log(app.recommendation_result);
// };
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

//
///
////
/////
/////
/////
////
///
//

// // NOTE> FOR NORMAL USER INPUT -->
// await app.getRelatedArtists_API();
// await app.getGenres_API();
// // await app.getRecommendedArtists_API(); // IMPORTANT> do not use
// /////////////////////////////////////////////////////////////////////////////////////

// // takes artists with a popularity of less than or equal to 50 to then do chaining methods on in an attempt to generate lesser popular artists for suggestion -->
// app.less_popular_artists = app.db_information.filter(function (artist) {
//   console.log(artist);
//   return artist.popularity <= 50;
// });

// // Generates lesser popular artists -->
// await app.artistPopularityArrangement();

// console.log(app.db_information);
// console.log(app.recommendation_result);
// console.log(app.less_popular_artists);

// const url_redirect = resetURLAddress();

// // saves to local storage to allow usage of collated array on Recommendations page -->
// location.href = `${url_redirect}recommendation_page/recommendation.html`;
// window.localStorage.setItem("cross-page_df", JSON.stringify(app.less_popular_artists));
