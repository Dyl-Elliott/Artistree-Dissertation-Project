// IMPORTANT NOTE> NEED TO -
// Make sure the artists which have been searched for do not appear in the DF

export default class DataminingHandler {
  //
  //
  //
  // For each new artist set information added into the function a new Artist will be created given the specified information provided.
  newDF = function (db_information) {
    // Whenever a artists is created it has to be provided this constructor typed information -->
    class Artist {
      // NOTE> could 'super' be relevant here????
      constructor(item_number, name, id, popularity) {
        this.item_number = item_number;
        this.name = name;
        this.id = id;
        this.popularity = popularity;
      }
    }

    let artist_index_information = [];
    let none_duplicates = [];
    let duplicates = [];
    let is_duplicate = false;
    let df_arr = [];

    // create a new Artists given the information provided from accumulated API calls -->
    db_information.forEach(function (value) {
      artist_index_information.push(new Artist(value[0], value[1], value[2], value[3]));
    });

    artist_index_information.forEach((value) => {
      // adds in the first item automatically if empty -->
      if (none_duplicates.length === 0) {
        none_duplicates.push(value);
      } else {
        // check to see if there is a duplicate -->
        none_duplicates.forEach((artist) => {
          if (artist.name == value.name) {
            is_duplicate = true;
            // add item to duplicates list -->
            duplicates.push(artist.name);
            return;
          }
        });
        // otherwise
        if (is_duplicate === false) {
          // add item to none-duplicates list -->
          none_duplicates.push(value);
        }
      }
      // reset to false for next iteration -->
      is_duplicate = false;
    });

    none_duplicates.forEach((item) => {
      // re-format to array for DataFrame coversion -->
      df_arr.push(new Array(item.item_number, item.name, item.id, item.popularity));
    });

    // Insert more less popular artists into search -->
    let df = new dfd.DataFrame(df_arr, { columns: ["Item_Number", "Artist_Name", "Artist_ID", "Popularity"] });

    // sorting based on the popularity to display in the tabled data -->
    df.sortValues("Popularity", { inplace: true });
    df.plot("plot_div").table();
  };
}
