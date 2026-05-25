const usuario =

JSON.parse(
localStorage.getItem(
"usuario"
)
);

/* ELEMENTOS */
const nomeInput =
document.getElementById(
"nome"
);

const emailInput =
document.getElementById(
"email"
);

const fotoPreview =
document.getElementById(
"previewFoto"
);

const fotoInput =
document.getElementById(
"fotoInput"
);

/* USER */
if(usuario) {

nomeInput.value =
usuario.nome;

emailInput.value =
usuario.email;

fotoPreview.src =

usuario.foto ||

"../assets/images/user.png";

}

/* FOTO */
fotoInput.addEventListener(

"change",

function() {

const arquivo =
this.files[0];

if(arquivo) {

const leitor =
new FileReader();

leitor.onload =
function(e) {

fotoPreview.src =
e.target.result;

};

leitor.readAsDataURL(
arquivo
);

}

}

);

/* SALVAR */
function salvarPerfil() {

usuario.nome =
nomeInput.value;

usuario.email =
emailInput.value;

/* FOTO */
usuario.foto =
fotoPreview.src;

/* SALVAR */
localStorage.setItem(

"usuario",

JSON.stringify(
usuario
)

);

alert(
"Perfil atualizado!"
);

window.location.reload();

}