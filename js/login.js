/* =========================
   USUÁRIO LOGADO
========================= */

const usuario =
    JSON.parse(
        localStorage.getItem("usuario")
    );

/* PROTEGER INDEX */
if(!usuario) {

    window.location.href =
        "login.html";

}

/* FOTO */
const foto =
    document.getElementById("user-photo");

/* NOME */
const nome =
    document.getElementById("user-name");

/* MENU */
const menu =
    document.getElementById("userMenu");

/* CARREGAR USUÁRIO */
if(usuario) {

    if(foto && usuario.foto) {

        foto.src =
            usuario.foto;

    }

    if(nome) {

        nome.innerText =
            usuario.nome;

    }

}

/* MENU USER */
function toggleMenu() {

    if(menu.style.display === "flex") {

        menu.style.display = "none";

    }

    else {

        menu.style.display = "flex";

    }

}

/* LOGOUT */
function logout() {

    localStorage.removeItem("usuario");

    window.location.href =
        "login.html";

}

/* =========================
   CARRINHO
========================= */

function atualizarCarrinho() {

    const carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];

    const contador =
        document.getElementById("cart-count");

    if(contador) {

        contador.innerText =
            carrinho.length;

    }

}

/* ADICIONAR */
function adicionarCarrinho(produto) {

    let carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];

    carrinho.push(produto);

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

    atualizarCarrinho();

    alert(
        produto.nome +
        " adicionado!"
    );

}

/* ABRIR */
function abrirCarrinho() {

    window.location.href =
        "carrinho.html";

}

/* INIT */
atualizarCarrinho();