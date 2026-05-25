const usuario =

JSON.parse(
localStorage.getItem(
"usuario"
)
);

/* LISTAR */
async function carregarTickets() {

const resposta =

await fetch(
"http://localhost:3000/tickets"
);

const tickets =
await resposta.json();

const lista =
document.getElementById(
"listaTickets"
);

lista.innerHTML = "";

tickets

.filter(ticket =>

ticket.usuarioId ===
usuario.id

)

.forEach(ticket => {

lista.innerHTML += `

<div class="ticket">

<h3>
${ticket.assunto}
</h3>

<p>
${ticket.mensagem}
</p>

${
ticket.resposta
?

`<div class="resposta">

<b>Resposta:</b>

${ticket.resposta}

</div>`

:

""
}

<span class="status">

${ticket.status}

</span>

</div>

`;

});

}

/* ABRIR */
async function abrirTicket() {

const assunto =

document.getElementById(
"assunto"
).value;

const mensagem =

document.getElementById(
"mensagem"
).value;

if(!assunto || !mensagem) {

alert(
"Preencha tudo"
);

return;

}

const resposta =

await fetch(

"http://localhost:3000/ticket",

{

method: "POST",

headers: {

"Content-Type":
"application/json"

},

body: JSON.stringify({

usuarioId:
usuario.id,

nome:
usuario.nome,

email:
usuario.email,

assunto,
mensagem

})

}

);

const dados =
await resposta.json();

if(dados.sucesso) {

alert(
"Ticket aberto!"
);

document.getElementById(
"assunto"
).value = "";

document.getElementById(
"mensagem"
).value = "";

carregarTickets();

}

}

/* INIT */
carregarTickets();