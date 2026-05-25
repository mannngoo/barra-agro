import {

db,
collection,
getDocs

}

from "./firebase.js";

/* =========================
PRODUTOS
========================= */

window.produtosFirebase = [];

/* =========================
CARREGAR PRODUTOS
========================= */

async function carregarHomeProdutos() {

try {

const snapshot =

await getDocs(

collection(
db,
"produtos"
)

);

/* ARRAY */

const produtos = [];

snapshot.forEach(doc => {

produtos.push({

id: doc.id,
...doc.data()

});

});

/* GLOBAL */

window.produtosFirebase =
produtos;

/* GRID */

const grid =
document.getElementById(
"homeGrid"
);

if(!grid) return;

grid.innerHTML = "";

/* LOOP */

produtos.forEach(produto => {

const div =
document.createElement(
"div"
);

div.classList.add(
"home-card"
);

div.innerHTML = `

<div class="home-img">

<img
src="${
produto.imagem ||
'/assets/images/default-product.jpg'
}"
alt="${produto.nome}">

</div>

<div class="home-info">

<div class="home-top">

<span>
${produto.categoria || "Produto"}
</span>

<small>
${produto.unidade || ""}
</small>

</div>

<h3>
${produto.nome}
</h3>

<strong>
R$ ${Number(produto.preco).toFixed(2)}
</strong>

<div class="home-buttons">

<button
class="btn-produto"
onclick="abrirProduto('${produto.id}')">

Ver Produto

</button>

<button
class="btn-cart"
onclick="adicionarCarrinho('${produto.id}')">

🛒

</button>

</div>

</div>

`;

grid.appendChild(div);

});

}

catch(err) {

console.log(err);

}

}

/* =========================
ABRIR PRODUTO
========================= */

window.abrirProduto =
function(id) {

window.location.href =

`/pages/produto.html?id=${id}`;

};

/* =========================
CARRINHO
========================= */

window.adicionarCarrinho =
function(id) {

/* PRODUTOS */

const produtos =
window.produtosFirebase || [];

/* FIND */

const produto =

produtos.find(p => p.id === id);

if(!produto) {

alert(
"Produto não encontrado"
);

return;

}

/* STORAGE */

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

const contador =
document.getElementById(
"cart-count"
);

if(contador) {

contador.innerText =
carrinho.length;

}

/* ALERT */

alert(
"Produto adicionado!"
);

};

/* =========================
INIT
========================= */

carregarHomeProdutos();