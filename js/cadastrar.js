function cadastro() {

    const nome =
        document.getElementById("nome").value;

    const email =
        document.getElementById("email").value;

    const senha =
        document.getElementById("senha").value;

    fetch("http://localhost:3000/cadastro", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            nome,
            email,
            senha

        })

    })

    .then(res => res.json())

    .then(data => {

        if(data.sucesso) {

            alert("Conta criada!");

            window.location.href =
                "login.html";

        }

        else {

            alert(data.erro);

        }

    });

}