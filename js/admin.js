/* =========================
FIREBASE
========================= */

const db = window.db;

const collection = window.collection;

const addDoc = window.addDoc;

const getDocs = window.getDocs;

const docFirebase = window.doc;

const deleteDocFirebase = window.deleteDoc;

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
SELECTS
========================= */

const categoriaSelect =
document.getElementById(
"categoria"
);

const subcategoriaSelect =
document.getElementById(
"subcategoria"
);

/* LOOP */

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

/* CHANGE */

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

/* =========================
PREVIEW
========================= */

const imagemInput =
document.getElementById(
"imagemFile"
);

const previewImagem =
document.getElementById(
"previewImagem"
);

imagemInput.addEventListener(

"change",

function() {

const file =
this.files[0];

if(!file) return;

previewImagem.src =

URL.createObjectURL(file);

previewImagem.style.display =
"block";

}

);

/* =========================
CADASTRAR PRODUTO
========================= */

async function cadastrarProduto() {

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

if(imagemInput.files[0]) {

const file =
imagemInput.files[0];

imagem =
await converterBase64(file);

}

/* FIREBASE */

await addDoc(

collection(db, "produtos"),

{

nome,
preco,
categoria,
subcategoria,
unidade,
tipoCotacao,
estoque,
imagem

}

);

/* ALERT */

alert(
"Produto cadastrado!"
);

/* RESET */

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

imagemInput.value = "";

previewImagem.style.display =
"none";

/* RELOAD */

carregarProdutos();

carregarDashboard();

}

catch(err) {

console.log(err);

alert(
"Erro ao cadastrar"
);

}

}

/* =========================
BASE64
========================= */

function converterBase64(file) {

return new Promise((resolve, reject) => {

const reader =
new FileReader();

reader.readAsDataURL(file);

reader.onload = () => {

resolve(reader.result);

};

reader.onerror = error => {

reject(error);

};

});

}

/* =========================
LISTAR PRODUTOS
========================= */

async function carregarProdutos() {

const snapshot =

await getDocs(

collection(db, "produtos")

);

const lista =
document.getElementById(
"listaProdutos"
);

lista.innerHTML = "";

/* LOOP */

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
Categoria:
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

async function deletarProduto(id) {

await deleteDocFirebase(

docFirebase(
db,
"produtos",
id
)

);

carregarProdutos();

carregarDashboard();

}

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
Tickets foram desativados
temporariamente.

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

collection(db, "produtos")

);

const produtos = [];

snapshot.forEach(doc => {

produtos.push(doc.data());

});

document.getElementById(
"totalProdutos"
).innerText =
produtos.length;

document.getElementById(
"totalPedidos"
).innerText =
0;

document.getElementById(
"totalTickets"
).innerText =
0;

document.getElementById(
"totalVendas"
).innerText =
"R$ 0,00";

}

/* INIT */

carregarProdutos();

carregarTickets();

carregarDashboard();