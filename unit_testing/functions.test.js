const functions = require("./functions");
// const genres = require("../genreJSON/genres");

// can write logic in the actual test() itself!
// can run all the test on save with Watch Mode == "testwatch": "jest --watchAll" (in package.json) - running npm testwatch to run the script

// NOTE---------------------------------------------------------------------------------------
// toBeNull == matches only null
// toBeUndefined == matches only undefined
// toBeDefined == is the opposite of toBeUndefined
// toBeTruthy == matches anything that an if statement treats as true
// toBeFalsy == matches anything that an if statement treats as false
// toMatch == matches a Regex
// toContain == should contain the value expected
// less than & greater than

// objects are reference types so use a different place in mempry == toEqual
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
// running a test before and after each test (or singularly)
// beforeEach(() => initDatabase());
// afterEach(() => closeDatabase());

// beforeAll(() => initDatabase());
// afterAll(() => closeDatabase());
//--------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------------APPLICATION TESTING-------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////
//
//
// Testing artist name formatting for getArist() API call -->
test("Testing artist name formatting for getArist() API call", () => {
  expect(functions.formatArtistName("Muse")).toBe("Muse#");
  expect(functions.formatArtistName("muse")).toBe("Muse#");
  expect(functions.formatArtistName(" muse")).toBe("Muse#");
  expect(functions.formatArtistName(" muse ")).toBe("Muse#");
  expect(functions.formatArtistName("    muse    ")).toBe("Muse#");
});

//
//
//
// NOTE> issues with module export -->
// test("Testing genres are returned", () => {
//   expect(
//     functions.getGenresList().toBe(``)
//   );
// });

//////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------------SPOTIFY API TESTING-------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////
//
//
// Testing getArtist API call --------------------------------------------------------------->
test("Testing getArtist API call", async () => {
  const artist_obj = await functions.getArtist("Muse");
  // console.log(`artist_obj is: ${artist_obj}`);

  expect(artist_obj).toBeDefined();

  expect(artist_obj.data).toHaveProperty("artists");
  expect(artist_obj.data.artists.items.length).toBe(50);

  expect(artist_obj.data.artists.items[0].name).toEqual("Muse");
  expect(artist_obj.data.artists.items[0].id).toEqual("12Chz98pHFMPJEknJQMWvI");
  expect(artist_obj.data.artists.items[0].genres).toEqual(["modern rock", "permanent wave", "rock"]);
});

//
//
// Testing getRelated API call ------------------------------------------------------------->
test("Testing getRelated API call", async () => {
  const related_artist_obj = await functions.getRelated("12Chz98pHFMPJEknJQMWvI");
  // console.log(`related_artist_obj is: ${related_artist_obj}`);

  expect(related_artist_obj).toBeDefined();

  expect(related_artist_obj).toHaveProperty("artists");
  expect(related_artist_obj.artists.length).toBe(20);
});

//
//
// Testing getGenre API call -->
test("Testing getGenre API call", async () => {
  const genre_artist_obj = await functions.getGenres("rock");
  // console.log(`genre_artist_obj is: ${genre_artist_obj}`);

  expect(genre_artist_obj).toBeDefined();

  expect(genre_artist_obj.artists.items).not.toBeUndefined();
  expect(genre_artist_obj.artists.items.length).toBe(50);

  expect(genre_artist_obj.artists.items[0].genres).toContain("rock");
  expect(genre_artist_obj.artists.items[49].genres).toContain("rock");
});

//
//
// Testing getAuthPerUserLogin authorization reference ------------------------------------->
test("Testing getAuthPerUserLogin authorization reference", async () => {
  const authorization_redirect = await functions.getAuthPerUserLogin();
  // console.log(`authorization_redirect is: ${authorization_redirect}`);

  expect(authorization_redirect).toBeDefined();

  expect(authorization_redirect).toBe(
    "https://accounts.spotify.com/authorize?client_id=ec16cb1a604b4204b895d057b9125038&redirect_uri=http://localhost:8000/&scope=playlist-read-private%20playlist-modify-private%20playlist-modify-public%20user-read-recently-played&response_type=token&show_dialog=true"
  );
});

//
//
// Testing to receive user access to Spotify ----------------------------------------------->
test("Testing to receive user access to Spotify", async () => {
  const user_auth = await functions.getUsernameAndSpotifyPlaylist();
  // console.log(`user_auth is: ${user_auth}`);

  // if a user HAS NOT logged in through Spotify -->
  if (user_auth === undefined) {
    console.log("Auth not provided");
    expect(user_auth).not.toBeDefined();
    // if a user HAS logged in through Spotify -->
  } else {
    console.log("Auth provided");
    expect(user_auth).toBeDefined();
    expect(user_auth).toHaveProperty("href");

    expect(user_auth.items.length).toEqual(20);
    expect(user_auth.items[0].owner.display_name).toBe("Dyl Elliott");
  }
});

//
//
// Testing playlist information creates new playlist ---------------------------------------->
test("Testing playlist information creates new playlist", async () => {
  const playlist = await functions.createPlaylist("takeabow88");
  console.log(`playlist is: ${playlist}`);

  if (playlist === "Playlist has not been created") {
    expect(playlist).toBe("Playlist has not been created");
  } else {
    expect(playlist).toBeDefined();
  }
});

//
//
// Testing retrieval of artist top tracks based on artist_id -------------------------------->
test("Testing retrieval of artist top tracks based on artist_id", async () => {
  // artist == Burden Affinity
  const artist_top_tracks = await functions.getArtistTopTracks("3eaBj2bMsW8wsURFSoKCb6");
  console.log(`artist_top_tracks is: ${artist_top_tracks}`);

  expect(artist_top_tracks).toBeDefined();
});

//
//
// Testing if items are added to selected playlist correctly -------------------------------->
test("Testing if items are added to selected playlist correctly", async () => {
  const add_tracks_to_playlist = await functions.addItemToSpotifyPlaylist(
    "08pgd3s4LzINEoXvQApZsO",
    "spotify:track:68EFXQRAS3hzWtkm4fSdBf"
  );
  console.log(`add_tracks_to_playlist is: ${add_tracks_to_playlist}`);

  if (add_tracks_to_playlist === "Track has not been added to playlist") {
    expect(add_tracks_to_playlist).toBe("Track has not been added to playlist");
  } else {
    expect(add_tracks_to_playlist).toBeDefined();
  }
});
