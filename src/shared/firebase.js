import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB5U1Aiw115owie8_Y0xv2JjQrTo0Cmf2w",
  authDomain: "yungram-896e4.firebaseapp.com",
  projectId: "yungram-896e4",
  storageBucket: "yungram-896e4.appspot.com",
  messagingSenderId: "576778553669",
  appId: "1:576778553669:web:ad4c5d57b40ec54c1d162c",
  measurementId: "G-MD37WQYMG5"
};

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export{auth, apiKey, firestore, storage};