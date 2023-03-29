// const express = require("express");
// const app = express();

const spotify_handler = require("./server/server_spotify_handler");
// const firebase_handler = require("./server_firebase_handler")

http = require("http");
fs = require("fs").promises;

let script_obj = [];
// let logged_in_state = false;
// let session_token = "";

// SERVER WHICH HANDLES REQUESTS FROM THE CLIENT PER PAGE LOAD -->
server = http
  .createServer(async function (req, res) {
    // server starts here -->
    console.log(`Incoming requests for ${req.url}`);

    // ----------------------------HOME PAGE-------------------------------
    if (req.url === "/") {
      try {
        const contents = await fs.readFile(__dirname + "/index.html");
        res.end(contents);
      } catch (err) {
        console.log(err);
      }
    } else if (req.url === "/script.js") {
      try {
        const contents = await fs.readFile(__dirname + "/script.js");
        res.writeHead("200", {
          "Content-Type": "text/javascript",
        });
        res.end(contents);
      } catch (err) {
        console.log(err);
      }
    } else if (req.url === "/style.css") {
      try {
        const contents = await fs.readFile(__dirname + "/style.css");
        res.end(contents);
      } catch (err) {
        console.log(err);
      }
      // --------------------LOCAL STORAGE/SESSION TOKEN--------------------
      // accepts from script / local storage -->
    } else if (req.url === "/set_session_token") {
      let body = "";

      req.on("data", (script_data) => {
        // console.log(`script_data is: ${script_data}`);
        body += script_data;
      });
      req.on("end", () => {
        // console.log(`body is ${body}`);
        script_obj = JSON.parse(body);
        // logged_in_state = script_obj.loggedInState;
        // session_token = script_obj.token;

        res.end();
      });
      // send to unit test script -->
    } else if (req.url === "/get_session_token") {
      // console.log("got request for session token");
      // console.log(`script_obj is: ${JSON.stringify(script_obj)}`);

      const contents = JSON.stringify(script_obj);
      res.end(contents);
    }

    // ----------------------------DANFOJS---------------------------------
    else if (req.url === "/dataframe.js") {
      try {
        const contents = await fs.readFile(__dirname + "/dataframe.js");
        res.writeHead("200", {
          "Content-Type": "text/javascript",
        });
        res.end(contents);
      } catch (err) {
        console.log(err);
      }
    }

    // NOTE> NOT NEEDED? using local storage instead...
    // -----------------------------COOKIE---------------------------------
    else if (req.url === "/cookie") {
      try {
        const contents = await fs.readFile(__dirname + "/script.js");
        res.setHeader("cookie", { session_token: "cookie" });
        res.end(
          JSON.stringify({
            cookie: "kajhfwai4rawcieyraw63ctbrpw9",
          })
        );
      } catch (err) {
        console.log(err);
      }
    }

    // --------------------------RECOMMENDATIONS---------------------------
    else if (req.url.includes("/recommendation_page/recommendation.html")) {
      try {
        const contents = await fs.readFile(__dirname + "/recommendation_page/recommendation.html");
        res.end(contents);
      } catch (err) {
        console.log(err);
      }
    } else if (req.url === "/recommendation_page/recommendation.css") {
      try {
        const contents = await fs.readFile(__dirname + "/recommendation_page/recommendation.css");
        res.end(contents);
      } catch (err) {
        console.log(err);
      }
    } else if (req.url === "/recommendation_page/recommendation.js") {
      try {
        const contents = await fs.readFile(__dirname + "/recommendation_page/recommendation.js");
        res.writeHead("200", {
          "Content-Type": "text/javascript",
        });
        res.end(contents);
      } catch (err) {
        console.log(err);
      }
    }

    // -----------------------------GENRES--------------------------------
    else if (req.url === "/genreJSON/genres") {
      try {
        const contents = await fs.readFile(__dirname + "/genreJSON/genres.js");
        res.writeHead("200", {
          "Content-Type": "text/javascript",
        });
        res.end(contents);
      } catch (err) {
        console.log(err);
      }
    }
    // ------------------------------------------------------------------
    else if (req.url === "/images/log.png") {
      try {
        const contents = await fs.readFile(__dirname + "/images/log.png");
        res.writeHead("200", {
          "Content-Type": "contentType",
        });
        res.end(contents);
      } catch (err) {
        console.log(err);
      }
    }

    // ------------------------------SPOTIFY------------------------------
    // THIS REQUEST COMES FROM SCRIPT.js ------>
    else if (req.url === "/spotify_website_module.js") {
      try {
        const contents = await fs.readFile(__dirname + "/spotify_website_module.js");
        res.writeHead("200", {
          "Content-Type": "text/javascript",
        });
        res.end(contents);
      } catch (err) {
        console.log(err);
      }
      // SYNTAX OF ALL API CALL IS MANAGED HERE -->
    } else if (req.url.includes("/spotify/")) {
      console.log(req.url);
      const contents = await spotify_handler.handleRequest(req.url);
      res.end(JSON.stringify(contents)); // JSON STRINGIFY - makes a string of a JS object
    } else {
      res.writeHead("404");
      res.end("<h1>404 page not found</h1>");
    }

    // -------------------------------LOGIN--------------------------------

    // else if (req.url === "/login.html") {
    //   try {
    //     const contents = await fs.readFile(__dirname + "/login.html");
    //     res.end(contents);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // } else if (req.url === "/login.js") {
    //   try {
    //     const contents = await fs.readFile(__dirname + "/login.js");
    //     res.writeHead("200", {
    //       "Content-Type": "text/javascript",
    //     });
    //     res.end(contents);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // } else if (req.url === "/login.css") {
    //   try {
    //     const contents = await fs.readFile(__dirname + "/login.css");
    //     res.writeHead("200", {
    //       "Content-Type": "text/javascript",
    //     });
    //     res.end(contents);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

    // -----------------------------FIREBASE-------------------------------
    // } else if (req.url === "/firebase") {
    //   try {
    //     // const contents = await fs.readFile(__dirname + "/firebase.js");
    //     const contents = await firebase_handler.handlerFirebaseRequest(req.url)
    //     res.writeHead("200", {
    //       // "Content-Type": "text/javascript",
    //     });
    //     res.end(firebase);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
    // else if (req.url.includes("firebase/")) { // "/save" ?
    //   const contents = await firebase_handler.handleRequest(req.url)
    //   res.end(JSON.stringify(contents)); // JSON STRINGIFY - makes a string of a JS object
    // }
    // -------------------------------------------------------------------

    // ------------------------------FIREBASE------------------------------
    // else if (req.url === "/server_firebase_handler.js") {
    //   try {
    //     const contents = await fs.readFile(__dirname + "/server_firebase_handler.js");
    //     res.writeHead("200", {
    //       "Content-Type": "module",
    //     });
    //     res.end(contents);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
  })
  .listen(8000);
console.log("Server running on port 8000");
