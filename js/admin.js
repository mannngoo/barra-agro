import {

db,
collection,
addDoc,
getDocs,
doc,
deleteDoc

}

from "./firebase.js";

/* =========================
ADMIN
========================= */

const ADMIN_EMAIL =
"matheuscoutinhoirespereira8@gmail.com";

/* USER */

const usuario =

JSON.parse(
localStorage.getItem(
"usuario"
)
);

/* BLOCK */

if(
!usuario ||
usuario.email !== ADMIN_EMAIL
) {

alert(
"Acesso negado"
);

window.location.href =
"/index.html";

}

/* =========================
CATEGORIAS
========================= */

const categorias = {

"Alimentos": [

"Açúcar",
"Arroz",
"Feijão",
"Milho",
"Soja",
"Café"

],

"Fertilizantes": [

"Ureia",
"NPK",
"Calcário"

],

"Animais": [

"Bovinos",
"Suínos",
"Aves"

]

};

/* =========================
ELEMENTOS
========================= */

const categoriaSelect =
document.getElementById(
"categoria"
);

const subcategoriaSelect =
document.getElementById(
"subcategoria"
);

const imagemInput =
document.getElementById(
"imagemFile"
);

const previewImagem =
document.getElementById(
"previewImagem"
);

/* =========================
CATEGORIAS
========================= */

if(categoriaSelect) {

Object.keys(categorias).forEach(cat => {

const option =
document.createElement(
"option"
);

option.value = cat;

option.innerText = cat;

categoriaSelect.appendChild(
option);

});

categoriaSelect.addEventListener(

"change",

function() {

subcategoriaSelect.innerHTML =

`<option value="">
Selecione a subcategoria
</option>`;

const subs =
categorias[this.value] || [];

subs.forEach(sub => {

const option =
document.createElement(
"option"
);

option.value = sub;

option.innerText = sub;

subcategoriaSelect.appendChild(
option);

});

}

);

}

/* =========================
PREVIEW
========================= */

if(imagemInput) {

imagemInput.onchange = e => {

const file =
e.target.files[0];

if(!file) return;

previewImagem.src =

URL.createObjectURL(file);

previewImagem.style.display =
"block";

};

}

/* =========================
BASE64
========================= */

function converterBase64(file) {

return new Promise((resolve, reject) => {

const reader =
new FileReader();

reader.readAsDataURL(file);

reader.onload = event => {

const img =
new Image();

img.src =
event.target.result;

img.onload = () => {

const canvas =
document.createElement(
"canvas"
);

const MAX_WIDTH = 600;

const scaleSize =
MAX_WIDTH / img.width;

canvas.width =
MAX_WIDTH;

canvas.height =
img.height * scaleSize;

const ctx =
canvas.getContext("2d");

ctx.drawImage(

img,
0,
0,
canvas.width,
canvas.height

);

const compressedBase64 =

canvas.toDataURL(
"image/jpeg",
0.5
);

resolve(
compressedBase64
);

};

};

reader.onerror = error => {

reject(error);

};

});

}

/* =========================
RESET FORM
========================= */

function resetarFormulario() {

document.getElementById(
"nome"
).value = "";

document.getElementById(
"preco"
).value = "";

document.getElementById(
"categoria"
).value = "";

document.getElementById(
"subcategoria"
).innerHTML =

`<option value="">
Selecione a subcategoria
</option>`;

document.getElementById(
"unidade"
).value = "";

document.getElementById(
"tipoCotacao"
).value = "";

document.getElementById(
"estoque"
).value = "";

if(imagemInput) {

imagemInput.value = "";

}

if(previewImagem) {

previewImagem.style.display =
"none";

}

}

/* =========================
CADASTRAR PRODUTO
========================= */

window.cadastrarProduto =
async function() {

try {

const nome =
document.getElementById(
"nome"
).value;

const preco =
document.getElementById(
"preco"
).value;

const categoria =
document.getElementById(
"categoria"
).value;

const subcategoria =
document.getElementById(
"subcategoria"
).value;

const unidade =
document.getElementById(
"unidade"
).value;

const tipoCotacao =
document.getElementById(
"tipoCotacao"
).value;

const estoque =
document.getElementById(
"estoque"
).value;

/* VALIDAÇÃO */

if(
!nome ||
!preco ||
!categoria
) {

alert(
"Preencha os campos"
);

return;

}

/* IMAGEM */

let imagem =
"/assets/images/default-product.jpg";

/* BASE64 */

if(
imagemInput &&
imagemInput.files[0]
) {

imagem =

await converterBase64(

imagemInput.files[0]

);

}

/* FIREBASE */

await addDoc(

collection(
db,
"produtos"
),

{

nome,
preco,
categoria,
subcategoria,
unidade,
tipoCotacao,
estoque,
imagem,
criadoEm:
Date.now()

}

);

alert(
"Produto cadastrado!"
);

resetarFormulario();

carregarProdutos();

carregarDashboard();

}

catch(err) {

console.log(err);

alert(
"Erro ao cadastrar produto"
);

}

};

/* =========================
LISTAR PRODUTOS
========================= */

async function carregarProdutos() {

const lista =
document.getElementById(
"listaProdutos"
);

if(!lista) return;

lista.innerHTML = "";

const snapshot =

await getDocs(

collection(
db,
"produtos"
)

);

snapshot.forEach(docItem => {

const produto = {

id: docItem.id,
...docItem.data()

};

const div =
document.createElement(
"div"
);

div.classList.add(
"produto-admin"
);

div.innerHTML = `

<img
src="${
produto.imagem ||
'/assets/images/default-product.jpg'
}">

<div class="produto-admin-info">

<h3>
${produto.nome}
</h3>

<p>
${produto.categoria}
</p>

<strong>
R$ ${produto.preco}
</strong>

</div>

<button
onclick="deletarProduto('${produto.id}')">

Excluir

</button>

`;

lista.appendChild(div);

});

}

/* =========================
DELETE
========================= */

window.deletarProduto =
async function(id) {

try {

await deleteDoc(

doc(
db,
"produtos",
id
)

);

carregarProdutos();

carregarDashboard();

}

catch(err) {

console.log(err);

}

};

/* =========================
TICKETS
========================= */

async function carregarTickets() {

const box =
document.getElementById(
"ticketsAdmin"
);

if(!box) return;

box.innerHTML =

`

<div class="ticket-admin">

<h3>
Sistema Firebase
</h3>

<p>
Tickets temporariamente desativados.
</p>

</div>

`;

}

/* =========================
DASHBOARD
========================= */

async function carregarDashboard() {

const snapshot =

await getDocs(

collection(
db,
"produtos"
)

);

const produtos = [];

snapshot.forEach(doc => {

produtos.push(doc.data());

});

const totalProdutos =
document.getElementById(
"totalProdutos"
);

if(totalProdutos) {

totalProdutos.innerText =
produtos.length;

}

const totalPedidos =
document.getElementById(
"totalPedidos"
);

if(totalPedidos) {

totalPedidos.innerText =
0;

}

const totalTickets =
document.getElementById(
"totalTickets"
);

if(totalTickets) {

totalTickets.innerText =
0;

}

const totalVendas =
document.getElementById(
"totalVendas"
);

if(totalVendas) {

totalVendas.innerText =
"R$ 0,00";

}

}

/* =========================
INIT
========================= */

carregarProdutos();

carregarTickets();

carregarDashboard();