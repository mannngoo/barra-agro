/* =========================
FIREBASE
========================= */
import {

auth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut

}

from "./firebase.js";
const auth = window.auth;

const createUserWithEmailAndPassword =
window.firebaseCreateUser;

const signInWithEmailAndPassword =
window.firebaseLogin

const signOutFirebase =
window.signOut;

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

/* BTN */

if(userButton) {

userButton.style.display =
"flex";

}

/* FOTO */

if(foto) {

foto.src =

usuario.foto ||

"/assets/images/default-user.png";

foto.onerror = function() {

this.src =
"/assets/images/default-user.png";

};

}

/* MENU FOTO */

if(menuPhoto) {

menuPhoto.src =

usuario.foto ||

"/assets/images/default-user.png";

menuPhoto.onerror = function() {

this.src =
"/assets/images/default-user.png";

};

}

/* NOME */

if(nome) {

nome.innerText =

usuario.nome ||
"Usuário";

}

/* ESCONDER LOGIN */

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
MENU USER
========================= */

function toggleMenu(event) {

if(event) {

event.stopPropagation();

}

if(!userMenu) return;

userMenu.classList.toggle(
"active"
);

}

/* FECHAR MENU */

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

async function logout() {

try {

await signOutFirebase(auth);

localStorage.removeItem(
"usuario"
);

window.location.reload();

}

catch(err) {

console.log(err);

}

}

/* =========================
CARRINHO
========================= */

function atualizarCarrinho() {

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

}

/* =========================
ABRIR CARRINHO
========================= */

function abrirCarrinho() {

window.location.href =
"/pages/carrinho.html";

}

/* =========================
ABRIR PRODUTOS
========================= */

function abrirProdutos() {

window.location.href =
"/pages/produtos.html";

}

/* =========================
ABRIR PRODUTO
========================= */

function abrirProduto(id) {

window.location.href =

`/pages/produto.html?id=${id}`;

}

/* =========================
ADICIONAR CARRINHO
========================= */

function adicionarCarrinho(id) {

const produtos =
window.produtosFirebase || [];

const produto =

produtos.find(p => p.id === id);

if(!produto) {

return alert(
"Produto não encontrado"
);

}

let carrinho =

JSON.parse(

localStorage.getItem(
"carrinho"
)

) || [];

/* PUSH */

carrinho.push(produto);

/* SAVE */

localStorage.setItem(

"carrinho",

JSON.stringify(carrinho)

);

/* UPDATE */

atualizarCarrinho();

/* ALERT */

alert(
"Produto adicionado!"
);

}

/* =========================
MODAIS
========================= */

function abrirLogin() {

document.getElementById(
"loginModal"
).classList.add(
"active"
);

}

function abrirCadastro() {

document.getElementById(
"cadastroModal"
).classList.add(
"active"
);

}

function fecharModais() {

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

}

/* =========================
CADASTRO
========================= */

async function cadastrar() {

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

/* FIREBASE */

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

/* SAVE */

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

alert(
err.message
);

}

}

/* =========================
LOGIN
========================= */

async function login() {

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

}

/* =========================
INIT
========================= */

atualizarCarrinho();