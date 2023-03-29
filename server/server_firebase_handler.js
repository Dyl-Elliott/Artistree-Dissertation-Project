// DO I EVEN NEED A DATABASE IF ALL THE USER NEEDS ACCESS TO IS THEIR OWN SPOTIFY ACCOUNT? (it could just be Spotify access only..)
// this will then allow then to add items to an exisiting or new playlist to their PERSONAL ACCOUNT.......

const axios = require("axios");
const firebase = require("firebase/app")
const auth = require("firebase/auth")
// const fire = require("firebase/firebase-storage/lite")
// const {user_details} = require("./login.js")

// import {credentials} from "./login"
// import Firebase from "./firebase";
// import Auth from "./firebase/auth";
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

firebaseConfig =  {
  apiKey: "AIzaSyDzVx0VSh6zpWq6mtYDM389MT6dfv1MyJw",
  authDomain: "artistree-c77f2.firebaseapp.com",
  projectId: "artistree-c77f2",
  storageBucket: "artistree-c77f2.appspot.com",
  messagingSenderId: "257577394335",
  appId: "1:257577394335:web:54e490115593ff056782aa",
  measurementId: "G-ZNCJ8N912D",
};

module.exports = {
  handleFirebaseRequest: async (req_url) => {
    try {
      const response = await axios({
        method: "POST",
        url: "/save",
        data: {
          user_id: "",
          email: "",
          password: ""
        }
      });
      return response.data;
    } catch (err) {
      throw Error(err);
    }
  },
}

// app = firebase.initializeApp(firebaseConfig)
// db = fire.getFirestore(app)

// Get a list of cities from your database -->
// async function getCities(db) {
//   const citiesCol = collection(db, 'cities');
//   const citySnapshot = await getDocs(citiesCol);
//   const cityList = citySnapshot.docs.map(doc => doc.data());
//   return cityList;
// }

// export { firebase };
