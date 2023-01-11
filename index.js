const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const bcrypt = require('bcrypt');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public/html"))
    .use(express.static(__dirname + "/public/scripts"))
    .use(express.static(__dirname + "/public/css"))
    .use(express.static(__dirname + "/public/res"))
    .use(express.static(__dirname + "/public/data"));
var nastavnici = require('./public/data/nastavnici.json');
var prisustva = require('./public/data/prisustva.json');


app.use(session({
    secret: 'nesto',
    resave: false,
    saveUninitialized: false
}));

function checkCredentials(username, password, req) {
    let result;
    var numNastavnici = nastavnici.length;
    for (i = 0; i < numNastavnici; i++) {
        if (nastavnici[i].nastavnik.username == username) {
            try {
                result = bcrypt.compare(password, nastavnici[i].nastavnik.password_hash);
            }
            catch {
                return false;
            }
            if (result) {
                req.session.user = nastavnici[i];
                return true;
            }
        }
    }
    return false;
}


app.post("/login", (req, res) => {

    let poruka = "";
    let username = req.body.username;
    let password = req.body.password;
    let uspjesnost = checkCredentials(username, password, req);
    if (uspjesnost === false || uspjesnost === undefined || uspjesnost === null) {
        poruka = "Neuspješna prijava";
        res.json({ poruka: poruka });

    } else {
        poruka = "Uspješna prijava";
        req.session.username = username;
        req.session.password = password;
        req.session.loggedIn = true;
        req.session.predmeti = req.session.user.predmeti;
        res.json({ poruka: poruka });
    }
});

app.post("/logout", (req, res) => {
    req.session.destroy();
    res.send({ poruka: "Uspješno ste odjavljeni" });
});

app.get("/prijava", function (req, res) {

    res.sendFile(__dirname + "/public/html/prijava.html");
});

app.get("/predmeti", function (req, res) {

    if (req.session.username == null && req.session.username == undefined) {
        res.json({ error: "Nastavnik nije loginovan" });
    }
    else {
        res.json({ predmeti: req.session.predmeti });
    }
});

app.get("/predmet/:naziv", function (req, res) {
    const naziv = req.params.naziv;
    for (let i = 0; i < prisustva.length; i++) {
        const predmet = prisustva[i]["predmet"];
        if (predmet === naziv) {
            return res.send({ prisustva: prisustva[i] });
        }
    }
    return res.status(404).send({ error: "Predmet nije pronađen" });

});

app.post("/prisustvo/predmet/:naziv/student/:index", function (req, res) {


    var indeks = req.params.index;
    var nazivPredmeta = req.params.naziv;

    var ind = 0;
    var promijenjeno = false;
    for (i = 0; i < prisustva.length; i++) {
        if (prisustva[i]["predmet"] == nazivPredmeta) {
            for (j = 0; j < prisustva[i]["prisustva"].length; j++) {
                if (prisustva[i]["prisustva"][j].index == indeks) {
                    if (prisustva[i]["prisustva"][j].sedmica == req.body.sedmica) {
                        ind = i;
                        promijenjeno = true;
                        console.log("mijenjanje");
                        prisustva[i]["prisustva"][j].predavanja = req.body.predavanja;
                        prisustva[i]["prisustva"][j].vjezbe = req.body.vjezbe;
                    }
                }
            }
        }

    }
    if (prisustva[ind]["prisustva"].find((x) => { return x.sedmica == req.body.sedmica && x.index == indeks })) console.log("nadjena sedmica");
    if (!promijenjeno && !prisustva[ind]["prisustva"].find((x) => { return x.sedmica == req.body.sedmica && x.index == indeks })) {
        console.log("push");
        console.log("i je " + ind + ", pokusalo se ubacit index: " + indeks + ", sedmica " + req.body.sedmica + ", predavanja " + req.body.predavanja + ", vjezbe " + req.body.vjezbe);
        prisustva[ind]["prisustva"].push({ sedmica: req.body.sedmica, predavanja: req.body.predavanja, vjezbe: req.body.vjezbe, index: parseInt(indeks) });
    }
    var stringJson = JSON.stringify(prisustva);

    fs.writeFile('./public/data/prisustva.json', stringJson, function (error) {
        if (error) {
            console.error("There was an error writing to the file:", error);
        } else {
            console.log("The file was written successfully.");
        }
    });
    var noviJson = prisustva[ind];
    res.send(noviJson);

});

app.listen(3000);
