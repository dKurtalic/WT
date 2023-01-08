window.onload = function () {
    pozoviAjax.getPredmeti(ispisi);
};
function ispisi(predmeti) {
    if (predmeti.error != undefined) {
        console.log("nije prosao");
        document.getElementById("nijeLoginovan").style.display = "block";
    }
    else {
        var menu = document.getElementById("listaPredmeta");
        for (var i = 0; i < predmeti.predmeti.length; i++) {
            var li = document.createElement("li");
            var button = document.createElement("button");
            button.innerHTML = predmeti.predmeti[i]
            button.addEventListener("click", buttonAction);
            li.appendChild(button);
            menu.appendChild(li);
        }
    }
}
function buttonAction() {
    var naziv = this.innerHTML;
    pozoviAjax.getPredmet(naziv, TabelaPrisustvo);
}
function logout() {
    pozoviAjax.postLogout(vratiNaPocetnu);
}

function vratiNaPocetnu(poruka) {
    window.location.replace("http://localhost:3000/prijava.html");
    document.getElementById("uspjesnaPrijava").innerHTML = poruka;
    document.getElementById("uspjesnaPrijava").style.display = "block";
}
function promijeniPrisustvo(index, sedmica, brojPredavanja, brojVjezbi) {
    const prisustvo = { "sedmica": sedmica, "predavanja": brojPredavanja, "vjezbe": brojVjezbi };
    const json = JSON.stringify(prisustvo);
    console.log("most ");
    var naziv = document.getElementById("nazivPredmeta").innerHTML;
    console.log("naziv dohvacenog predmeta je " + naziv);
    pozoviAjax.postPrisustvo(naziv, index, sedmica, brojPredavanja, brojVjezbi, null);
}