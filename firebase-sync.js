import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

    getFirestore,
    collection,
    addDoc,
    onSnapshot

} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyDxB0uv18Gm2mGGxQ5VeVkGFo60lQWinxk",

  authDomain: "inventarioxs.firebaseapp.com",

  projectId: "inventarioxs",

  storageBucket: "inventarioxs.firebasestorage.app",

  messagingSenderId: "505000534882",

  appId: "1:505000534882:web:6ca047a06bdfdfd9a1823b"

};

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

window.syncFirebase = {

    db,
    collection,
    addDoc,
    onSnapshot
};
window.db = db;