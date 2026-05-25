const params =

new URLSearchParams(
window.location.search
);

const id =
params.get("id");

/* PEGAR PRODUTO */
fetch(

`http://localhost:3000/produto/${id}`

)

.then(response => response.json())

.then(produto => {

if(!produto) {

document.getElementById(
"produtoContainer"
).innerHTML = `

<h1 style="
color:white;
text-align:center;
">

Produto não encontrado

</h1>

`;

return;

}

/* COTAÇÃO */
fetch(

`http://localhost:3000/cotacao/${produto.tipoCotacao}`

)

.then(res => res.json())

.then(cotacao => {

document.getElementById(
"produtoContainer"
).innerHTML = `

<img src="../${produto.imagem}">

<div class="produto-info">

<div class="produto-categoria">

${produto.categoria}

</div>

<h1>

${produto.nome}

</h1>

<div class="produto-unidade">

${produto.unidade}

</div>

<div class="produto-cotacao">

Cotação atual:

<span>

R$ ${cotacao.cotacao}

</span>

</div>

<strong>

R$ ${produto.preco}

</strong>

<button onclick='adicionarCarrinho({

id:${produto.id},

nome:"${produto.nome}",

preco:${produto.preco},

imagem:"${produto.imagem}"

})'>

Comprar

</button>

</div>

`;

});

})

.catch(err => {

console.log(err);

document.getElementById(
"produtoContainer"
).innerHTML = `

<h1 style="
color:red;
text-align:center;
">

Erro ao carregar produto

</h1>

`;

});

/* CARRINHO */
function adicionarCarrinho(produto) {

let carrinho =

JSON.parse(
localStorage.getItem(
"carrinho"
)
) || [];

carrinho.push(produto);

localStorage.setItem(

"carrinho",

JSON.stringify(carrinho)

);

alert(

produto.nome +
" adicionado ao carrinho!"

);

}