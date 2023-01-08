function ispisi(poruka) {
    if (poruka.poruka != "Uspješna prijava") {

        document.getElementById("neuspjesnaPrijava").style.display = "block";
    }
    else {
        window.location.replace("http://localhost:3000/predmeti.html");
    }
}
function login() {
    var usernameInput = document.getElementById("usernameInput").value;
    var passwordInput = document.getElementById("passwordInput").value;
    pozoviAjax.postLogin(usernameInput, passwordInput, ispisi);
}
