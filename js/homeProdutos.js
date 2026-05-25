async function carregarHomeProdutos() {

const resposta =

await fetch(
"http://localhost:3000/produtos"
);

const produtos =
await resposta.json();

const grid =

document.getElementById(
"homeGrid"
);

if(!grid) return;

grid.innerHTML = "";

/* LOOP */
produtos.forEach(produto => {

const div =
document.createElement("div");

div.classList.add(
"home-card"
);

div.innerHTML = `

<div class="home-img">

<img
src="${
produto.imagem
? `http://localhost:3000${produto.imagem}`
: './assets/images/default-product.jpg'
}"
alt="${produto.nome}">

</div>

<div class="home-info">

<div class="home-top">

<span>

${produto.categoria}

</span>

<small>

${produto.unidade}

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
onclick="abrirProduto(${produto.id})">

Ver Produto

</button>

<button
class="btn-cart"
onclick="adicionarCarrinho(${produto.id})">

🛒

</button>

</div>

</div>

`;

grid.appendChild(div);

});

}

/* =========================
ABRIR PRODUTO
========================= */

function abrirProduto(id) {

window.location.href =

`pages/produto.html?id=${id}`;

}

/* =========================
CARRINHO
========================= */

async function adicionarCarrinho(id) {

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

/* ALERT */
alert(
"Produto adicionado!"
);

/* UPDATE */
if(typeof atualizarCarrinho === "function") {

atualizarCarrinho();

}

}

carregarHomeProdutos();