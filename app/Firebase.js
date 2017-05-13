import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "yourAPIkeyhere",
  authDomain: "yourapp.firebaseapp.com",
  databaseURL: "https://yourapp.firebaseio.com",
  storageBucket: "yourapp.appspot.com",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

module.exports = firebaseApp
