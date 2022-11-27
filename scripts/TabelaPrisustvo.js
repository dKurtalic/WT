var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://kit.fontawesome.com/b43fea0bec.js ';
document.body.appendChild(script);


let TabelaPrisustvo = function (divRef, podaci) {
    //privatni atributi modula

    divRef.innerHTML = "";
    var najvecaSedmica = Math.max.apply(Math, podaci.prisustva.map(function (prisustvo) { return prisustvo.sedmica; }));
    var ispravnost = true;
    var mojaMinimalnaPrisustvovanaSedmica;
    var trenutnaSedmica = najvecaSedmica;
    var tabela;
    var popuniTabelu = function () {
        iscrtajTabelu();

        for (var i = 0; i < podaci.studenti.length; i++) {
            var student = podaci.studenti[i];

            tabela += "<tr>";
            tabela += "<td>" + podaci.studenti[i].ime + "</td>";
            var indeks = podaci.studenti[i].index;
            tabela += "<td>" + indeks + "</td>";

            var mojaPrisustva = podaci.prisustva.filter(function (prisustvo) { if (prisustvo.index == indeks) { return prisustvo.sedmica; } });
            mojaPrisustva = mojaPrisustva.map(function (prisustvo) { return prisustvo.sedmica });

            var mojaPosljednjaPrisustvovanaSedmica = Math.max.apply(Math, mojaPrisustva);
            mojaMinimalnaPrisustvovanaSedmica = Math.min.apply(Math, mojaPrisustva);

            var j = 0;
            for (; j < mojaPosljednjaPrisustvovanaSedmica; j++) {
                if (j == trenutnaSedmica - 1) {
                    prikaziDetalje(indeks);
                }

                else {
                    prikaziBezDetalja(indeks, j + 1);
                }

            }
            for (; j < 8; j++) {
                tabela += "<td></td>";
            }

            tabela += "</tr>";
        }


        tabela += "</table><br>";
        divRef.innerHTML = tabela;
    }



    var iscrtajTabelu = function () {
        tabela = "<h1>" + podaci.predmet + "</h1>" + "<table>";
        tabela += "<tr>"
        tabela += "<th>Ime i prezime</th><th>Indeks</th>";
        tabela += "<th>I</th><th>II</th><th>III</th><th>IV</th><th>V</th><th>VI</th><th>VII</th><th>VIII-XV</th>";
        tabela += "</tr>";
    }


    let izracunajPrisustvoZaStudenta = function (index, sedmica) {
        var ima = podaci.prisustva.filter(function (prisustvo) { return prisustvo.index == index && prisustvo.sedmica == sedmica; }).length > 0;
        if (sedmica == 1 && !ima) return 0;
        if (!ima) return 0;
        var brojOdrzanih = podaci.brojPredavanjaSedmicno + podaci.brojVjezbiSedmicno;

        for (var k = 0; k < podaci.prisustva.length; k++) {
            if (podaci.prisustva[k].index == index && podaci.prisustva[k].sedmica == sedmica) {
                return ((podaci.prisustva[k].predavanja + podaci.prisustva[k].vjezbe) / brojOdrzanih) * 100;
            }
        }
    }

    var daLiJeBioPrisutanNaPredavanju = function (indeks, sedmica) {

        for (var k = 0; k < podaci.prisustva.length; k++) {
            if (podaci.prisustva[k].index == indeks && podaci.prisustva[k].sedmica == sedmica) {
                return podaci.prisustva[k].predavanja !== undefined ? podaci.prisustva[k].predavanja : 0;
            }
        }
    }
    var daLiJeBioPrisutanNaVjezbama = function (indeks, sedmica) {
        for (var k = 0; k < podaci.prisustva.length; k++) {
            if (podaci.prisustva[k].index == indeks && podaci.prisustva[k].sedmica == sedmica) {
                return podaci.prisustva[k].vjezbe !== undefined ? podaci.prisustva[k].vjezbe : 0;
            }
        }
    }

    var postojiLiStudentSaIndeksom = function (indeks) {
        for (var i = 0; i < podaci.studenti.length; i++) {
            if (podaci.studenti[i].index == indeks) return true;
        }
        return false;
    }
    var validirajPodatke = function () {


        //broj prisustva je manji od 0
        podaci.prisustva.forEach(function (prisustvo) {
            if (prisustvo.vjezbe < 0 || prisustvo.predavanja < 0) ispravnost = false;
        });

        var jedinstveniIndeksi;
        //postoje dva studenta s istim indeksom      
        if (ispravnost) {
            jedinstveniIndeksi = podaci.studenti.map(function (student) { return student.index; });
            jedinstveniIndeksi = jedinstveniIndeksi.filter(function (item, index) { return jedinstveniIndeksi.indexOf(item) == index });
            ispravnost = (jedinstveniIndeksi.length == podaci.studenti.length);
        }


        //Npr. uneseno je prisustvo za sedmice 1 i 3 ali nijedan student nema prisustvo za sedmicu 2
        if (ispravnost) {
            var sedmice = podaci.prisustva.map(function (prisustvo) { return prisustvo.sedmica });


            for (var i = 0; i < podaci.prisustva.length - 1; i++) {

                if (i != 0 && !sedmice.includes(i + 1) && i != najvecaSedmica) { ispravnost = false; break; }
            }
        }

        //Isti student ima dva ili više unosa prisustva za istu sedmicu    
        if (ispravnost) {
            for (var i = 0; i < podaci.prisustva.length; i++) {
                for (var j = i + 1; j < podaci.prisustva.length; j++) {
                    if (podaci.prisustva[i].index == podaci.prisustva[j].index && podaci.prisustva[i].sedmica == podaci.prisustva[j].sedmica) {
                        ispravnost = false;
                        break;
                    }
                }
            }
        }

        //broj prisustva na predavanju ili vjezbi je veci od broja odrzanih predavanja/vjezbi
        if (ispravnost) {
            var brojOdrzanihPredavanja = podaci.brojPredavanjaSedmicno;
            var brojOdrzanihVjezbi = podaci.brojVjezbiSedmicno;
            for (var i = 0; i < podaci.prisustva.length; i++) {
                if (podaci.prisustva[i].predavanja > brojOdrzanihPredavanja || podaci.prisustva[i].vjezbe > brojOdrzanihVjezbi) {
                    ispravnost = false;
                    break;
                }
            }
        }

        //prisustvo za studenta koji nije na listi studenata
        if (ispravnost) {
            for (var i = 0; i < podaci.prisustva.length; i++) {
                ispravnost = postojiLiStudentSaIndeksom(podaci.prisustva[i].index);
                if (!ispravnost) break;
            }
        }


        if (!ispravnost) { divRef.innerHTML = "Podaci o prisustvu nisu validni"; return false; }
        return true;
    }

    var prikaziDetalje = function (indeks) {

        var brojPrisustvovanihPredavanja = daLiJeBioPrisutanNaPredavanju(indeks, trenutnaSedmica);
        var brojNeprisustvovanihPredavanja = podaci.brojPredavanjaSedmicno - brojPrisustvovanihPredavanja;
        var brojPrisustvovanihVjezbi = daLiJeBioPrisutanNaVjezbama(indeks, trenutnaSedmica);
        var brojNeprisustvovanihVjezbi = podaci.brojVjezbiSedmicno - brojPrisustvovanihVjezbi;

        // ugniježdena tabela
        tabela += "<td class=\"bezMargine\">";
        tabela += "<table class=\"unutrasnja\">";
        tabela += "<tr>"
        for (var m = 0; m < podaci.brojPredavanjaSedmicno; m++) {
            tabela += "<td>" + "P  " + (m + 1) + "</td>";
        }
        for (var n = 0; n < podaci.brojVjezbiSedmicno; n++) {
            tabela += "<td>" + "V  " + (n + 1) + "</td>";
        }
        tabela += "</tr><tr>"

        for (var g = 0; g < brojPrisustvovanihPredavanja; g++) { tabela += "<td class=\"prisutan\"></td>"; }


        for (var l = 0; l < brojNeprisustvovanihPredavanja; l++) {
            tabela += "<td class=\"neprisutan\"></td>"
        }

        for (var g = 0; g < brojPrisustvovanihVjezbi; g++) {
            tabela += "<td class=\"prisutan\"></td>";
        }

        for (var l = 0; l < brojNeprisustvovanihVjezbi; l++) {
            tabela += "<td class=\"neprisutan\"></td>"
        }

        tabela += "</tr>"
        tabela += "</table>"
        tabela += "</td>";
    }

    var prikaziBezDetalja = function (indeks, sedmica) {
        var prisustvo = izracunajPrisustvoZaStudenta(indeks, sedmica);
        if (prisustvo == 0) prisustvo = " ";
        else prisustvo = prisustvo + "%";
        tabela += "<td>" + prisustvo + "</td>";
    }



    if (validirajPodatke()) {
        popuniTabelu();
    }


    //implementacija metoda
    let sljedecaSedmica = function () {
        if (ispravnost) {
            trenutnaSedmica++;
            if (trenutnaSedmica > najvecaSedmica) trenutnaSedmica = najvecaSedmica;
            if (trenutnaSedmica <= najvecaSedmica) {
                popuniTabelu();
            }
        }
    }


    let prethodnaSedmica = function () {
        if (ispravnost) {
            trenutnaSedmica--;
            if (trenutnaSedmica < mojaMinimalnaPrisustvovanaSedmica) trenutnaSedmica = mojaMinimalnaPrisustvovanaSedmica;
            if (trenutnaSedmica < 1) trenutnaSedmica = 1;
            if (trenutnaSedmica > 0) popuniTabelu();
        }
    }

    var dugme = document.createElement("button");
    dugme.onclick = prethodnaSedmica;
    dugme.innerHTML = "<i class=\"fa-solid fa-arrow-left\"></i>";

    var dugme2 = document.createElement("button");
    dugme2.onclick = sljedecaSedmica;
    dugme2.innerHTML = "<i class=\"fa-solid fa-arrow-right\"></i>";

    if (ispravnost) {
        document.body.appendChild(dugme);
        document.body.appendChild(dugme2);
    }


    return {
        sljedecaSedmica: sljedecaSedmica,
        prethodnaSedmica: prethodnaSedmica
    }
};
