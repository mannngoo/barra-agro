import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

getFirestore,
collection,
addDoc,
getDocs,
doc,
deleteDoc

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {

getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

/* FIREBASE */

const db =
getFirestore(app);

const auth =
getAuth(app);

/* EXPORT */

export {

db,
auth,
collection,
addDoc,
getDocs,
doc,
deleteDoc,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut

};