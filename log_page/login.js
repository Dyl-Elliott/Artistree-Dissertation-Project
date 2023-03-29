// import {getDatabase, ref, set} from "./config"
// const database = getDatabase();
// import { handleFirebaseRequest } from "./server_firebase_handler.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const form = document.getElementById("form");
const button = document.getElementById("button");
// const error = document.getElementById("error");

const credentials = {
  user_id: 0,
  email: "",
  password: "",
};

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (password.value.length < 6 || password.value.length > 15) {
    console.log("password is formatted wrong");
  } else {
    credentials.user_id++;
    credentials.email = email.value;
    credentials.password = password.value;

    console.log(credentials);
  }

  // writeUserData(credentials.user_id, credentials.email, credentials.password)
});

// function writeUserData(userId, email, password) {

//   set(ref(database, 'users/' + userId), {
//     email: email,
//     password: password
//   });
// }

// module.exports = { credentials }
export default { credentials };
