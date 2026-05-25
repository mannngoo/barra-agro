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
option
);

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
option
);

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

/* FORM DATA */
const formData =
new FormData();

formData.append(
"nome",
nome
);

formData.append(
"preco",
preco
);

formData.append(
"categoria",
categoria
);

formData.append(
"subcategoria",
subcategoria
);

formData.append(
"unidade",
unidade
);

formData.append(
"tipoCotacao",
tipoCotacao
);

formData.append(
"estoque",
estoque
);

/* FOTO */
if(
imagemInput.files[0]
) {

formData.append(
"imagem",
imagemInput.files[0]
);

}

/* FETCH */
const resposta =

await fetch(

"http://localhost:3000/produto",

{

method: "POST",

body: formData

}

);

/* TEXTO */
const texto =
await resposta.text();

console.log(texto);

/* JSON */
const dados =
JSON.parse(texto);

/* SUCESSO */
if(dados.sucesso) {

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

else {

alert(
"Erro ao cadastrar"
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
LISTAR PRODUTOS
========================= */

async function carregarProdutos() {

const resposta =

await fetch(
"http://localhost:3000/produtos"
);

const produtos =
await resposta.json();

const lista =
document.getElementById(
"listaProdutos"
);

lista.innerHTML = "";

/* LOOP */
produtos.forEach(produto => {

const div =
document.createElement(
"div"
);

div.classList.add(
"produto-admin"
);

div.innerHTML = `

<img
src="http://localhost:3000${produto.imagem}">

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
onclick="deletarProduto(${produto.id})">

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

await fetch(

`http://localhost:3000/produto/${id}`,

{

method: "DELETE"

}

);

carregarProdutos();

carregarDashboard();

}

/* =========================
TICKETS
========================= */

async function carregarTickets() {

const resposta =

await fetch(
"http://localhost:3000/tickets"
);

const tickets =
await resposta.json();

const box =
document.getElementById(
"ticketsAdmin"
);

if(!box) return;

box.innerHTML = "";

/* LOOP */
tickets.forEach(ticket => {

const div =
document.createElement(
"div"
);

div.classList.add(
"ticket-admin"
);

div.innerHTML = `

<h3>
${ticket.assunto}
</h3>

<p>
${ticket.mensagem}
</p>

<textarea
id="resp-${ticket.id}">

</textarea>

<button
onclick="responderTicket(${ticket.id})">

Responder

</button>

`;

box.appendChild(div);

});

}

/* =========================
RESPONDER
========================= */

async function responderTicket(id) {

const resposta =

document.getElementById(
`resp-${id}`
).value;

await fetch(

"http://localhost:3000/ticket/responder",

{

method: "POST",

headers: {

"Content-Type":
"application/json"

},

body: JSON.stringify({

id,
resposta

})

}

);

alert(
"Ticket respondido!"
);

carregarTickets();

}

/* =========================
DASHBOARD
========================= */

async function carregarDashboard() {

const produtosRes =
await fetch(
"http://localhost:3000/produtos"
);

const produtos =
await produtosRes.json();

const pedidosRes =
await fetch(
"http://localhost:3000/pedidos"
);

const pedidos =
await pedidosRes.json();

const ticketsRes =
await fetch(
"http://localhost:3000/tickets"
);

const tickets =
await ticketsRes.json();

let vendas = 0;

pedidos.forEach(p => {

vendas += p.total;

});

document.getElementById(
"totalProdutos"
).innerText =
produtos.length;

document.getElementById(
"totalPedidos"
).innerText =
pedidos.length;

document.getElementById(
"totalTickets"
).innerText =
tickets.length;

document.getElementById(
"totalVendas"
).innerText =
`R$ ${vendas.toFixed(2)}`;

}

/* INIT */
carregarProdutos();

carregarTickets();

carregarDashboard();