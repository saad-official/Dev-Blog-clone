import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// import firebase from "firebase/app";
// import "firebase/auth";
// import "firebase/firebase-store";

const firebaseConfig = {
  apiKey: "AIzaSyAiIgPtXKYXPQOsdSGPuqnaPSjFtQ0QoGs",
  authDomain: "nextfire-5753f.firebaseapp.com",
  projectId: "nextfire-5753f",
  storageBucket: "nextfire-5753f.appspot.com",
  messagingSenderId: "1024882960926",
  appId: "1:1024882960926:web:09153afe2f415a4bd59c0f",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// export const auth = firebase.auth();
// export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
// export const firestore = firebase.firestore();
// export const storage = firebase.storage();

const db = firebase.firestore();
export const auth = firebase.auth();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const increment = firebase.firestore.FieldValue.increment;

// Storage exports
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export default db;

// heklper function
// get a user/{uid} document with a username
export async function getUserWithUsername(username) {
  const usersRef = db.collection("users");
  const query = usersRef.where("username", "==", username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

// convert firebase document to json
export function postToJSON(doc) {
  const data = doc.data();
  console.log("data", data);
  return {
    ...data,
    createdAt: data?.createdAt?.toMillis() || 0,
    updatedAt: data?.updatedAt?.toMillis() || 0,
  };
}
