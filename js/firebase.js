// FIREBASE

import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {

getFirestore,
collection,
addDoc,
getDocs,
doc,
deleteDoc

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* CONFIG */

const firebaseConfig = {

apiKey: "AIzaSyDEGM1I4cmfVCZdfYK4q78u2RItZYhlh94",

authDomain: "barra-agro.firebaseapp.com",

projectId: "barra-agro",

storageBucket: "barra-agro.firebasestorage.app",

messagingSenderId: "272668777172",

appId: "1:272668777172:web:5b140f852a520ff4de3941"

};

/* INIT */

const app =
initializeApp(firebaseConfig);

/* AUTH */

const auth =
getAuth(app);

/* DB */

const db =
getFirestore(app);

/* WINDOW */

window.auth = auth;

window.db = db;

window.createUserWithEmailAndPassword =
createUserWithEmailAndPassword;

window.signInWithEmailAndPassword =
signInWithEmailAndPassword;

window.signOut =
signOut;

window.collection =
collection;

window.addDoc =
addDoc;

window.getDocs =
getDocs;

window.doc =
doc;

window.deleteDoc =
deleteDoc;