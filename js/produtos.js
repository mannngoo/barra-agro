async function carregarProdutos() {

const resposta =

await fetch(

);

const produtos =
await resposta.json();

/* GRID */
const grid =

document.getElementById(
"produtosGrid"
);

grid.innerHTML = "";

/* SIDEBAR */
const sidebar =

document.querySelector(
".sidebar-categorias"
);

let categorias = {};

/* LOOP */
produtos.forEach(produto => {

/* CATEGORIAS */
if(!categorias[produto.categoria]) {

categorias[produto.categoria] = {};

}

if(

!categorias[produto.categoria]
[produto.subcategoria]

) {

categorias[produto.categoria]
[produto.subcategoria] = 0;

}

categorias[produto.categoria]
[produto.subcategoria]++;

/* PRODUTOS */
grid.innerHTML += `

<div class="produto-card">

<img src="../${produto.imagem}">

<div class="produto-info">

<p class="produto-unidade">

${produto.unidade}

</p>

<h3>
${produto.nome}
</h3>

<!-- COTAÇÃO -->
<div class="cotacao-box">

<div class="cotacao-topo">

<div>

<h4>

Indicador ${produto.tipoCotacao}

</h4>

<p>

Fonte: Cepea

</p>

</div>

</div>

<div class="cotacao-grid">

<div>

<span>
Valor
</span>

<strong>

R$ ${gerarCotacao(
produto.tipoCotacao
)}

</strong>

</div>

<div>

<span>
Variação
</span>

<strong class="variacao">

${gerarVariacao()}

</strong>

</div>

</div>

</div>

<div class="preco">

R$ ${produto.preco}

</div>

<button>

Comprar

</button>

<button class="btn-secundario">

Ver produto

</button>

</div>

</div>

`;

});

/* SIDEBAR */
sidebar.innerHTML = `

<h2>
Categorias
</h2>

`;

for(let categoria in categorias) {

sidebar.innerHTML += `

<div class="categoria-box">

<h3>
${categoria}
</h3>

<ul>

${Object.entries(
categorias[categoria]
)

.map(([sub, total]) => `

<li>

<a href="#">

${sub}

<span>
${total}
</span>

</a>

</li>

`).join("")}

</ul>

</div>

`;

}

/* ACCORDION */
document.addEventListener(

"click",

function(e) {

if(
e.target.matches(
".categoria-box h3"
)
) {

e.target.parentElement
.classList.toggle(
"active"
);

}

}

);

}

/* =========================
COTAÇÃO
========================= */

function gerarCotacao(tipo) {

if(tipo === "milho") {

return "65,28";

}

if(tipo === "soja") {

return "138,40";

}

if(tipo === "boi") {

return "276,80";

}

return "0,00";

}

/* VARIAÇÃO */
function gerarVariacao() {

const numero =

(Math.random() * 2 - 1)
.toFixed(2);

return `${numero}%`;

}

/* INIT */
carregarProdutos();