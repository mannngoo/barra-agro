/* =========================
FIREBASE HOME PRODUTOS
COMPLETO
========================= */

const db = window.db;

const collection = window.collection;

const getDocs = window.getDocs;

/* =========================
CARREGAR PRODUTOS
========================= */

async function carregarHomeProdutos() {

try {

/* FIREBASE */

const snapshot =

await getDocs(

collection(
db,
"produtos"
)

);

/* ARRAY */

const produtos = [];

/* LOOP */

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

/* CLEAR */

grid.innerHTML = "";

/* LOOP PRODUTOS */

produtos.forEach(produto => {

const div =
document.createElement(
"div"
);

div.classList.add(
"home-card"
);

/* HTML */

div.innerHTML = `

<div class="home-img">

<img
src="${
produto.imagem
? produto.imagem
: '/assets/images/default-product.jpg'
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

/* APPEND */

grid.appendChild(div);

});

}

catch(err) {

console.log(err);

alert(
"Erro ao carregar produtos"
);

}

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

/* CARRINHO */

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

if(typeof atualizarCarrinho === "function") {

atualizarCarrinho();

}

/* ALERT */

alert(
"Produto adicionado!"
);

}

/* =========================
INIT
========================= */

carregarHomeProdutos();