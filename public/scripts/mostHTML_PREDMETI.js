
window.onload = function () {
    poziviAjax.getPredmeti(ispisi);
};
function ispisi(predmeti) {

    if (predmeti == undefined || predmeti == null) {
        console.log("most html predmeti");
        document.getElementById("nijeLoginovan").style.display = "block";
    }
    else {
        console.log("most html predmeti2");

        var menu = document.getElementById("listaPredmeta");
        for (var i = 0; i < predmeti.length; i++) {
            var li = document.createElement("li");
            var button = document.createElement("button");
            button.innerHTML = predmeti[i]
            button.addEventListener("click", buttonAction);
            li.appendChild(button);
            menu.appendChild(li);
        }
    }
}
function buttonAction() {
    var naziv = this.innerHTML;
    poziviAjax.getPredmet(naziv, iscrtajTabelu);
}
function iscrtajTabelu(data) {
    var divRef = document.getElementById("tabelaZaPopunit");
    console.log("\nDATA KOJI SE SALJE " + JSON.stringify(data));
    TabelaPrisustvo(divRef, data);
}
function logout() {
    poziviAjax.postLogout(vratiNaPocetnu);
}

function vratiNaPocetnu(poruka) {
    window.location.replace("http://localhost:3000/prijava.html");
    document.getElementById("uspjesnaPrijava").innerHTML = poruka;
    document.getElementById("uspjesnaPrijava").style.display = "block";
}
function promijeniPrisustvo(index, sedmica, brojPredavanja, brojVjezbi) {
    var prisustvo = { sedmica: sedmica, predavanja: brojPredavanja, vjezbe: brojVjezbi };
    var json = JSON.stringify(prisustvo);
    var naziv = document.getElementById("nazivPredmeta").innerHTML;
    poziviAjax.postPrisustvo(naziv, index, json, crtanje);

}

function crtanje(arg) {
    var divRef = document.getElementById("tabelaZaPopunit");
    console.log("Ovo je u arg " + arg);
    TabelaPrisustvo(divRef, arg);

}