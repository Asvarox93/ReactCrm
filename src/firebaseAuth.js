import firebase from "firebase/app";
import "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var config = {
  apiKey: "AIzaSyBjuZouh3cgmj-nGB74CUKebSMgDZ4AvyM",
  authDomain: "reactcrm-2477b.firebaseapp.com",
  databaseURL: "https://reactcrm-2477b.firebaseio.com",
  projectId: "reactcrm-2477b",
  storageBucket: "reactcrm-2477b.appspot.com",
  messagingSenderId: "699971482779"
};

firebase.initializeApp(config);
