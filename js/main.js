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

/* FOTO PERFIL */
if(foto) {

if(

usuario.foto &&
usuario.foto !== ""

) {

foto.src =

`http://localhost:3000${usuario.foto}`;

}

else {

foto.src =
"./assets/images/default-user.png";

}

/* ERRO IMG */
foto.onerror = function() {

this.src =
"./assets/images/default-user.png";

};

}

/* MENU FOTO */
if(menuPhoto) {

if(

usuario.foto &&
usuario.foto !== ""

) {

menuPhoto.src =

`http://localhost:3000${usuario.foto}`;

}

else {

menuPhoto.src =
"./assets/images/default-user.png";

}

/* ERRO IMG */
menuPhoto.onerror = function() {

this.src =
"./assets/images/default-user.png";

};

}

/* NOME */
if(nome) {

nome.innerText =
usuario.nome;

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

function logout() {

localStorage.removeItem(
"usuario"
);

window.location.reload();

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

/* ABRIR */
function abrirCarrinho() {

window.location.href =
"./pages/carrinho.html";

}

/* =========================
PRODUTOS
========================= */

function abrirProdutos() {

window.location.href =
"./pages/produtos.html";

}

/* =========================
ABRIR PRODUTO
========================= */

function abrirProduto(id) {

window.location.href =

`./pages/produto.html?id=${id}`;

}

/* =========================
ADICIONAR CARRINHO
========================= */

async function adicionarCarrinho(id) {

try {

const resposta =

await fetch(

`http://localhost:3000/produto/${id}`

);

const produto =
await resposta.json();

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

catch(err) {

console.log(err);

alert(
"Erro ao adicionar"
);

}

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

const fotoInput =

document.getElementById(
"cadastroFoto"
);

/* FORM DATA */
const formData =
new FormData();

formData.append(
"nome",
nome
);

formData.append(
"email",
email
);

formData.append(
"senha",
senha
);

/* FOTO */
if(
fotoInput &&
fotoInput.files[0]
) {

formData.append(

"foto",

fotoInput.files[0]

);

}

/* FETCH */
const resposta =

await fetch(

"http://localhost:3000/cadastro",

{

method: "POST",

body: formData

}

);

const dados =
await resposta.json();

/* SUCESSO */
if(dados.sucesso) {

alert(
"Conta criada!"
);

fecharModais();

}

else {

alert(
dados.erro
);

}

}

catch(err) {

console.log(err);

alert(
"Erro no servidor"
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

const resposta =

await fetch(

"http://localhost:3000/login",

{

method: "POST",

headers: {

"Content-Type":
"application/json"

},

body: JSON.stringify({

email,
senha

})

}

);

const dados =
await resposta.json();

if(dados.sucesso) {

localStorage.setItem(

"usuario",

JSON.stringify(
dados.usuario
)

);

alert(
"Login realizado!"
);

window.location.reload();

}

else {

alert(
dados.erro
);

}

}

catch(err) {

console.log(err);

alert(
"Erro no servidor"
);

}

}

/* INIT */
atualizarCarrinho();