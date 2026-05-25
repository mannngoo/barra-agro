async function cadastro() {

try {

const nome =
document.getElementById("nome").value;

const email =
document.getElementById("email").value;

const senha =
document.getElementById("senha").value;

/* FIREBASE */

const userCredential =

await createUserWithEmailAndPassword(

auth,
email,
senha

);

/* USER */

const usuario = {

uid:
userCredential.user.uid,

nome,
email,

foto:
"/assets/images/default-user.png"

};

/* SAVE */

localStorage.setItem(

"usuario",

JSON.stringify(usuario)

);

/* ALERT */

alert("Conta criada!");

/* REDIRECT */

window.location.href =
"/pages/login.html";

}

catch(err) {

console.log(err);

alert(err.message);

}

}