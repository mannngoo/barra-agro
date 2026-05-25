import {

auth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut

}

from "./firebase.js";

/* =========================
USUÁRIO
========================= */

const usuario =

JSON.parse(
localStorage.getItem(
"usuario"
)
);

/* ELEMENTOS */

const foto =
document.getElementById(
"user-photo"
);

const userButton =
document.getElementById(
"userButton"
);

const nome =
document.getElementById(
"user-name"
);

const menuPhoto =
document.getElementById(
"menu-photo"
);

const userMenu =
document.getElementById(
"userMenu"
);

/* =========================
USER
========================= */

if(usuario) {

if(userButton) {

userButton.style.display =
"flex";

}

if(foto) {

foto.src =

usuario.foto ||

"/assets/images/default-user.png";

}

if(menuPhoto) {

menuPhoto.src =

usuario.foto ||

"/assets/images/default-user.png";

}

if(nome) {

nome.innerText =

usuario.nome ||
"Usuário";

}

const authButtons =

document.querySelector(
".auth-buttons"
);

if(authButtons) {

authButtons.style.display =
"none";

}

}

/* =========================
MENU
========================= */

window.toggleMenu =
function(event) {

if(event) {

event.stopPropagation();

}

if(!userMenu) return;

userMenu.classList.toggle(
"active"
);

};

/* =========================
FECHAR MENU
========================= */

document.addEventListener(

"click",

function() {

if(userMenu) {

userMenu.classList.remove(
"active"
);

}

}

);

/* =========================
LOGOUT
========================= */

window.logout =
async function() {

await signOut(auth);

localStorage.removeItem(
"usuario"
);

window.location.reload();

};

/* =========================
CARRINHO
========================= */

window.atualizarCarrinho =
function() {

const carrinho =

JSON.parse(
localStorage.getItem(
"carrinho"
)
) || [];

const contador =

document.getElementById(
"cart-count"
);

if(contador) {

contador.innerText =
carrinho.length;

}

};

/* =========================
MODAIS
========================= */

window.abrirLogin =
function() {

document.getElementById(
"loginModal"
).classList.add(
"active"
);

};

window.abrirCadastro =
function() {

document.getElementById(
"cadastroModal"
).classList.add(
"active"
);

};

window.fecharModais =
function() {

document.getElementById(
"loginModal"
).classList.remove(
"active"
);

document.getElementById(
"cadastroModal"
).classList.remove(
"active"
);

};

/* =========================
CADASTRO
========================= */

window.cadastrar =
async function() {

try {

const nome =

document.getElementById(
"cadastroNome"
).value;

const email =

document.getElementById(
"cadastroEmail"
).value;

const senha =

document.getElementById(
"cadastroSenha"
).value;

const userCredential =

await createUserWithEmailAndPassword(

auth,
email,
senha

);

const usuario = {

uid:
userCredential.user.uid,

nome,
email,

foto:
"/assets/images/default-user.png"

};

localStorage.setItem(

"usuario",

JSON.stringify(usuario)

);

alert(
"Conta criada!"
);

window.location.reload();

}

catch(err) {

console.log(err);

alert(err.message);

}

};

/* =========================
LOGIN
========================= */

window.login =
async function() {

try {

const email =

document.getElementById(
"loginEmail"
).value;

const senha =

document.getElementById(
"loginSenha"
).value;

const userCredential =

await signInWithEmailAndPassword(

auth,
email,
senha

);

const usuario = {

uid:
userCredential.user.uid,

email:
userCredential.user.email,

nome:
userCredential.user.email,

foto:
"/assets/images/default-user.png"

};

localStorage.setItem(

"usuario",

JSON.stringify(usuario)

);

alert(
"Login realizado!"
);

window.location.reload();

}

catch(err) {

console.log(err);

alert(
"Email ou senha inválidos"
);

}

};

/* INIT */

window.atualizarCarrinho(); 
/* =========================
ABRIR CARRINHO
========================= */

window.abrirCarrinho =
function() {

window.location.href =
"/pages/carrinho.html";

};