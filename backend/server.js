/* =========================
DEPENDÊNCIAS
========================= */

const cors =
require("cors");

const bcrypt =
require("bcrypt");

const express =
require("express");

const sqlite3 =
require("sqlite3").verbose();

const multer =
require("multer");

const path =
require("path");

const fs =
require("fs");

const app =
express();

/* =========================
MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

/* =========================
UPLOADS
========================= */

if(!fs.existsSync("./uploads")) {

fs.mkdirSync("./uploads");

}

/* STATIC */
app.use(

"/uploads",

express.static(
path.join(__dirname, "uploads")
)

);

/* STORAGE */
const storage =

multer.diskStorage({

destination:
path.join(__dirname, "uploads"),

filename:
(req, file, cb) => {

cb(

null,

Date.now() +
path.extname(file.originalname)

);

}

});

const upload =
multer({ storage });

/* =========================
BANCO
========================= */

const db =
new sqlite3.Database(
"./database.db"
);

/* =========================
TABELA PRODUTOS
========================= */

db.run(`

CREATE TABLE IF NOT EXISTS produtos (

id INTEGER PRIMARY KEY AUTOINCREMENT,

nome TEXT,

preco REAL,

imagem TEXT,

categoria TEXT,

unidade TEXT,

tipoCotacao TEXT

)

`);

/* =========================
TABELA USUÁRIOS
========================= */

db.run(`

CREATE TABLE IF NOT EXISTS usuarios (

id INTEGER PRIMARY KEY AUTOINCREMENT,

nome TEXT,

email TEXT UNIQUE,

senha TEXT,

foto TEXT,

admin INTEGER DEFAULT 0

)

`);

/* =========================
TABELA TICKETS
========================= */

db.run(`

CREATE TABLE IF NOT EXISTS tickets (

id INTEGER PRIMARY KEY AUTOINCREMENT,

usuarioId INTEGER,

nome TEXT,

email TEXT,

assunto TEXT,

mensagem TEXT,

resposta TEXT,

status TEXT,

data TEXT

)

`);

/* =========================
TABELA PEDIDOS
========================= */

db.run(`

CREATE TABLE IF NOT EXISTS pedidos (

id INTEGER PRIMARY KEY AUTOINCREMENT,

usuarioId INTEGER,

total REAL,

frete REAL,

status TEXT,

data TEXT

)

`);

/* =========================
TABELA PEDIDO PRODUTOS
========================= */

db.run(`

CREATE TABLE IF NOT EXISTS pedido_produtos (

id INTEGER PRIMARY KEY AUTOINCREMENT,

pedidoId INTEGER,

produtoId INTEGER,

nome TEXT,

preco REAL,

imagem TEXT

)

`);

/* =========================
LISTAR PRODUTOS
========================= */

app.get("/produtos", (req, res) => {

db.all(

"SELECT * FROM produtos",

[],

(err, rows) => {

if(err) {

return res
.status(500)
.json(err);

}

res.json(rows);

}

);

});

/* =========================
PRODUTO POR ID
========================= */

app.get("/produto/:id", (req, res) => {

const id =
req.params.id;

db.get(

"SELECT * FROM produtos WHERE id = ?",

[id],

(err, row) => {

if(err) {

return res
.status(500)
.json(err);

}

res.json(row);

}

);

});

/* =========================
CADASTRAR PRODUTO
========================= */
/* =========================
CADASTRAR PRODUTO
========================= */

app.post(

"/produto",

upload.single("imagem"),

(req, res) => {

try {

const nome =
req.body.nome;

const preco =
req.body.preco;

const categoria =
req.body.categoria;

const unidade =
req.body.unidade;

const tipoCotacao =
req.body.tipoCotacao;

/* IMG */
let imagem =
"/uploads/default-product.jpg";

/* FOTO */
if(req.file) {

imagem =
"/uploads/" +
req.file.filename;

}

/* INSERT */
db.run(

`

INSERT INTO produtos (

nome,
preco,
imagem,
categoria,
unidade,
tipoCotacao

)

VALUES (?, ?, ?, ?, ?, ?)

`,

[

nome,
preco,
imagem,
categoria,
unidade,
tipoCotacao

],

function(err) {

if(err) {

console.log(err);

return res
.status(500)
.json({

erro:
"Erro ao salvar produto"

});

}

res.json({

sucesso: true

});

}

);

}

catch(err) {

console.log(err);

res.status(500).json({

erro:
"Erro no servidor"

});

}

});

/* =========================
DELETAR PRODUTO
========================= */

app.delete("/produto/:id", (req, res) => {

const id =
req.params.id;

db.run(

"DELETE FROM produtos WHERE id = ?",

[id],

function(err) {

if(err) {

return res
.status(500)
.json(err);

}

res.json({

sucesso: true

});

}

);

});

/* =========================
COTAÇÃO
========================= */

app.get("/cotacao/:tipo", (req, res) => {

const tipo =
req.params.tipo;

let cotacao = 0;

if(tipo === "milho") {

cotacao = 63.20;

}

else if(tipo === "soja") {

cotacao = 138.40;

}

else if(tipo === "boi") {

cotacao = 276.80;

}

res.json({

cotacao

});

});

/* =========================
CADASTRAR USUÁRIO
========================= */

app.post(

"/cadastro",

upload.single("foto"),

async (req, res) => {

try {

const {

nome,
email,
senha

} = req.body;

/* FOTO */
let foto =

"/uploads/default-user.png";

if(req.file) {

foto =
"/uploads/" +
req.file.filename;

}

/* HASH */
const senhaHash =

await bcrypt.hash(
senha,
10
);

/* INSERT */
db.run(

`

INSERT INTO usuarios (

nome,
email,
senha,
foto

)

VALUES (?, ?, ?, ?)

`,

[

nome,
email,
senhaHash,
foto

],

function(err) {

if(err) {

console.log(err);

return res
.status(500)
.json({

erro:
"Email já cadastrado"

});

}

res.json({

sucesso: true

});

}

);

}

catch(err) {

console.log(err);

res.status(500).json(err);

}

});

/* =========================
LOGIN
========================= */

app.post("/login", (req, res) => {

const {

email,
senha

} = req.body;

db.get(

"SELECT * FROM usuarios WHERE email = ?",

[email],

async (err, usuario) => {

if(err || !usuario) {

return res
.status(401)
.json({

erro:
"Usuário não encontrado"

});

}

const senhaCorreta =

await bcrypt.compare(

senha,
usuario.senha

);

if(!senhaCorreta) {

return res
.status(401)
.json({

erro:
"Senha inválida"

});

}

res.json({

sucesso: true,

usuario: {

id: usuario.id,

nome: usuario.nome,

email: usuario.email,

foto: usuario.foto,

admin: usuario.admin

}

});

}

);

});

/* =========================
CRIAR PEDIDO
========================= */

app.post("/pedido", (req, res) => {

const {

usuarioId,
produtos,
total,
frete

} = req.body;

/* INSERT PEDIDO */
db.run(

`

INSERT INTO pedidos (

usuarioId,
total,
frete,
status,
data

)

VALUES (?, ?, ?, ?, ?)

`,

[

usuarioId || null,
total,
frete,
"Aguardando pagamento",
new Date().toLocaleString()

],

function(err) {

if(err) {

console.log(err);

return res
.status(500)
.json(err);

}

const pedidoId =
this.lastID;

/* LOOP */
produtos.forEach(produto => {

db.run(

`

INSERT INTO pedido_produtos (

pedidoId,
produtoId,
nome,
preco,
imagem

)

VALUES (?, ?, ?, ?, ?)

`,

[

pedidoId,
produto.id || null,
produto.nome,
produto.preco,
produto.imagem || ""

]

);

});

/* RESPONSE */
res.json({

sucesso: true,
pedidoId

});

}

);

});

/* =========================
LISTAR PEDIDOS
========================= */

app.get("/pedidos", (req, res) => {

db.all(

"SELECT * FROM pedidos ORDER BY id DESC",

[],

(err, rows) => {

if(err) {

return res
.status(500)
.json(err);

}

res.json(rows);

}

);

});

/* =========================
ABRIR TICKET
========================= */

app.post("/ticket", (req, res) => {

const {

usuarioId,
nome,
email,
assunto,
mensagem

} = req.body;

db.run(

`

INSERT INTO tickets (

usuarioId,
nome,
email,
assunto,
mensagem,
resposta,
status,
data

)

VALUES (?, ?, ?, ?, ?, ?, ?, ?)

`,

[

usuarioId,
nome,
email,
assunto,
mensagem,
"",
"Aberto",
new Date().toLocaleString()

],

function(err) {

if(err) {

return res
.status(500)
.json(err);

}

res.json({

sucesso: true

});

}

);

});

/* =========================
LISTAR TICKETS
========================= */

app.get("/tickets", (req, res) => {

db.all(

"SELECT * FROM tickets ORDER BY id DESC",

[],

(err, rows) => {

if(err) {

return res
.status(500)
.json(err);

}

res.json(rows);

}

);

});

/* =========================
RESPONDER TICKET
========================= */

app.post("/ticket/responder", (req, res) => {

const {

id,
resposta

} = req.body;

db.run(

`

UPDATE tickets

SET resposta = ?,
status = ?

WHERE id = ?

`,

[

resposta,
"Respondido",
id

],

function(err) {

if(err) {

return res
.status(500)
.json(err);

}

res.json({

sucesso: true

});

}

);

});

/* =========================
SERVER
========================= */

app.listen(3000, () => {

console.log(
"Servidor rodando na porta 3000"
);

});