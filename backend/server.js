/* =========================
DEPENDÊNCIAS
========================= */

const cors = require("cors");
const bcrypt = require("bcrypt");
const express = require("express");
const Database = require("better-sqlite3");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

/* =========================
PATHS
========================= */

const ROOT =
path.resolve(__dirname, "..");

const UPLOADS =
path.join(__dirname, "uploads");

const DATABASE =
path.join(__dirname, "database.db");

/* =========================
MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
extended: true
}));

/* =========================
STATIC
========================= */

app.use(
express.static(ROOT)
);

app.use(
"/uploads",
express.static(UPLOADS)
);

/* =========================
UPLOADS
========================= */

if(!fs.existsSync(UPLOADS)) {

fs.mkdirSync(UPLOADS);

}

/* =========================
MULTER
========================= */

const storage =
multer.diskStorage({

destination:
(req, file, cb) => {

cb(
null,
UPLOADS
);

},

filename:
(req, file, cb) => {

cb(

null,

Date.now() +
path.extname(
file.originalname
)

);

}

});

const upload =
multer({
storage
});

/* =========================
BANCO
========================= */

const db =
new Database(DATABASE);

/* =========================
CRIAR TABELAS
========================= */

db.prepare(`

CREATE TABLE IF NOT EXISTS produtos (

id INTEGER PRIMARY KEY AUTOINCREMENT,

nome TEXT,

preco REAL,

imagem TEXT,

categoria TEXT,

unidade TEXT,

tipoCotacao TEXT

)

`).run();

db.prepare(`

CREATE TABLE IF NOT EXISTS usuarios (

id INTEGER PRIMARY KEY AUTOINCREMENT,

nome TEXT,

email TEXT UNIQUE,

senha TEXT,

foto TEXT,

admin INTEGER DEFAULT 0

)

`).run();

db.prepare(`

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

`).run();

db.prepare(`

CREATE TABLE IF NOT EXISTS pedidos (

id INTEGER PRIMARY KEY AUTOINCREMENT,

usuarioId INTEGER,

total REAL,

frete REAL,

status TEXT,

data TEXT

)

`).run();

db.prepare(`

CREATE TABLE IF NOT EXISTS pedido_produtos (

id INTEGER PRIMARY KEY AUTOINCREMENT,

pedidoId INTEGER,

produtoId INTEGER,

nome TEXT,

preco REAL,

imagem TEXT

)

`).run();

/* =========================
HOME
========================= */

app.get("/", (req, res) => {

res.sendFile(
path.join(ROOT, "index.html")
);

});

/* =========================
PAGES
========================= */

app.get("/pages/:page", (req, res) => {

res.sendFile(

path.join(
ROOT,
"pages",
req.params.page
)

);

});

/* =========================
LISTAR PRODUTOS
========================= */

app.get("/produtos", (req, res) => {

try {

const produtos =
db.prepare(

"SELECT * FROM produtos ORDER BY id DESC"

).all();

res.json(produtos);

}

catch(err) {

console.log(err);

res.status(500).json({

erro:
"Erro ao buscar produtos"

});

}

});

/* =========================
PRODUTO POR ID
========================= */

app.get("/produto/:id", (req, res) => {

try {

const produto =
db.prepare(

"SELECT * FROM produtos WHERE id = ?"

).get(req.params.id);

res.json(produto);

}

catch(err) {

console.log(err);

res.status(500).json({

erro:
"Erro ao buscar produto"

});

}

});

/* =========================
CADASTRAR PRODUTO
========================= */

app.post(

"/produto",

upload.single("imagem"),

(req, res) => {

try {

const {

nome,
preco,
categoria,
unidade,
tipoCotacao

} = req.body;

let imagem =
"/uploads/default-product.jpg";

if(req.file) {

imagem =
"/uploads/" +
req.file.filename;

}

db.prepare(`

INSERT INTO produtos (

nome,
preco,
imagem,
categoria,
unidade,
tipoCotacao

)

VALUES (?, ?, ?, ?, ?, ?)

`).run(

nome,
preco,
imagem,
categoria,
unidade,
tipoCotacao

);

res.json({

sucesso: true

});

}

catch(err) {

console.log(err);

res.status(500).json({

erro:
"Erro ao cadastrar produto"

});

}

});

/* =========================
DELETAR PRODUTO
========================= */

app.delete("/produto/:id", (req, res) => {

try {

db.prepare(

"DELETE FROM produtos WHERE id = ?"

).run(req.params.id);

res.json({

sucesso: true

});

}

catch(err) {

console.log(err);

res.status(500).json({

erro:
"Erro ao deletar produto"

});

}

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

let foto =
"/uploads/default-user.png";

if(req.file) {

foto =
"/uploads/" +
req.file.filename;

}

const senhaHash =
await bcrypt.hash(
senha,
10
);

db.prepare(`

INSERT INTO usuarios (

nome,
email,
senha,
foto

)

VALUES (?, ?, ?, ?)

`).run(

nome,
email,
senhaHash,
foto

);

res.json({

sucesso: true

});

}

catch(err) {

console.log(err);

res.status(500).json({

erro:
"Erro no cadastro"

});

}

});

/* =========================
LOGIN
========================= */

app.post("/login", async (req, res) => {

try {

const {

email,
senha

} = req.body;

const usuario =
db.prepare(

"SELECT * FROM usuarios WHERE email = ?"

).get(email);

if(!usuario) {

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

catch(err) {

console.log(err);

res.status(500).json({

erro:
"Erro no login"

});

}

});

/* =========================
CRIAR PEDIDO
========================= */

app.post("/pedido", (req, res) => {

try {

const {

usuarioId,
produtos,
total,
frete

} = req.body;

const pedido =
db.prepare(`

INSERT INTO pedidos (

usuarioId,
total,
frete,
status,
data

)

VALUES (?, ?, ?, ?, ?)

`).run(

usuarioId || null,
total,
frete,
"Aguardando pagamento",
new Date().toLocaleString()

);

const pedidoId =
pedido.lastInsertRowid;

produtos.forEach(produto => {

db.prepare(`

INSERT INTO pedido_produtos (

pedidoId,
produtoId,
nome,
preco,
imagem

)

VALUES (?, ?, ?, ?, ?)

`).run(

pedidoId,
produto.id || null,
produto.nome,
produto.preco,
produto.imagem || ""

);

});

res.json({

sucesso: true,
pedidoId

});

}

catch(err) {

console.log(err);

res.status(500).json({

erro:
"Erro ao criar pedido"

});

}

});

/* =========================
LISTAR PEDIDOS
========================= */

app.get("/pedidos", (req, res) => {

try {

const pedidos =
db.prepare(

"SELECT * FROM pedidos ORDER BY id DESC"

).all();

res.json(pedidos);

}

catch(err) {

console.log(err);

res.status(500).json({

erro:
"Erro ao buscar pedidos"

});

}

});

/* =========================
ABRIR TICKET
========================= */

app.post("/ticket", (req, res) => {

try {

const {

usuarioId,
nome,
email,
assunto,
mensagem

} = req.body;

db.prepare(`

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

`).run(

usuarioId,
nome,
email,
assunto,
mensagem,
"",
"Aberto",
new Date().toLocaleString()

);

res.json({

sucesso: true

});

}

catch(err) {

console.log(err);

res.status(500).json({

erro:
"Erro ao abrir ticket"

});

}

});

/* =========================
LISTAR TICKETS
========================= */

app.get("/tickets", (req, res) => {

try {

const tickets =
db.prepare(

"SELECT * FROM tickets ORDER BY id DESC"

).all();

res.json(tickets);

}

catch(err) {

console.log(err);

res.status(500).json({

erro:
"Erro ao buscar tickets"

});

}

});

/* =========================
RESPONDER TICKET
========================= */

app.post("/ticket/responder", (req, res) => {

try {

const {

id,
resposta

} = req.body;

db.prepare(`

UPDATE tickets

SET resposta = ?,
status = ?

WHERE id = ?

`).run(

resposta,
"Respondido",
id

);

res.json({

sucesso: true

});

}

catch(err) {

console.log(err);

res.status(500).json({

erro:
"Erro ao responder ticket"

});

}

});

/* =========================
SERVER
========================= */

const PORT =
process.env.PORT || 3000;

app.listen(PORT, () => {

console.log(

`Servidor rodando na porta ${PORT}`

);

});