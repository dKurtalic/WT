const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const bcrypt = require('bcrypt');
const app = express();
const db = require("./public/db");
var priprema = require("./public/pripremi");
app.use(express.static(__dirname + "/public/html"))
    .use(express.static(__dirname + "/public/scripts"))
    .use(express.static(__dirname + "/public/css"))
    .use(express.static(__dirname + "/public/res"))
    .use(express.static(__dirname + "/public/data"));


const Nastavnik = require("./public/models/nastavnik")
const Student = require("./public/models/student")
const Predmet = require("./public/models/predmet")
const Prisustvo = require("./public/models/prisustvo")

Nastavnik.hasMany(Predmet);
Predmet.belongsTo(Nastavnik);
Student.hasMany(Prisustvo);
Predmet.hasMany(Prisustvo);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'nesto',
    resave: false,
    saveUninitialized: false
}));




async function checkCredentials(username, password, req) {
    let result;
    var nastavnik = null;
    Nastavnik.findOne({ where: { username: username } }).then(function (result) {
        console.log("NJegovi " + result.password_hash + ", uneseni " + password);
        if (bcrypt.compare(password, result.password_hash)) {
            console.log("prosao");
            req.session.nid = result.id;
            return result;
        }
    });

    return null;
}


app.post("/login", async (req, res) => {
    const studentCount = await Student.count();
    if (studentCount < 1) {
        izvrsiPripremu();
    }
    let poruka = "";
    let username = req.body.username;
    let password = req.body.password;
    let uspjesnost = false;
    await Nastavnik.findOne({ where: { username: username } }).then(function (result) {
        console.log("Njegovi " + result.password_hash + ", uneseni " + password);
        bcrypt.compare(password, result.password_hash).then(function (rez) {
            console.log("jesu li " + rez);
            if (rez) {
                console.log("prosao");
                req.session.nid = result.id;

                var nastavnik = result;

                if (nastavnik != null) {
                    req.session.nid = nastavnik.id;
                    uspjesnost = true;
                    console.log("Uspjesno log");
                    poruka = "Uspješna prijava";
                    req.session.username = username;
                    req.session.password = password;
                    req.session.loggedIn = true;
                    res.json({ poruka: poruka });
                }
            }
            else {
                poruka = "Neuspješna prijava";
                res.json({ poruka: poruka });
            }
        });

    });



});

app.post("/logout", (req, res) => {
    req.session.destroy();
    res.send({ poruka: "Uspješno ste odjavljeni" });
});

app.get("/prijava", function (req, res) {

    res.sendFile(__dirname + "/public/html/prijava.html");
});

app.get("/predmeti", async function (req, res) {

    if (req.session.username == null && req.session.username == undefined) {
        res.json({ error: "Nastavnik nije loginovan" });
    }
    else {

        var prof; var nekiPredmeti;
        await Nastavnik.findByPk(req.session.nid).then(async function (result) {
            prof = result;
            var njegoviPredmeti = await Predmet.findAll({ where: { nastavnikId: prof.id } });
            var json2 = "[";
            for (var i = 0; i < njegoviPredmeti.length; i++) {
                json2 += "\"" + njegoviPredmeti[i].naziv + "\"";
                if (i != njegoviPredmeti.length - 1) json2 += ",";
            }
            json2 += "]";

            res.json(JSON.parse(json2));
        }
        );
    }
});

app.get("/predmet/:naziv", function (req, res) {
    const naziv = req.params.naziv;
    Predmet.findOne({ where: { naziv: naziv } }).then(function (predm) {
        if (!predm) return res.status(404).send({ error: "Predmet nije pronađen" });
        Prisustvo.findAll({ where: { predmetId: predm.id } }).then(function (pris) {
            var studentIds = pris.map(p => p.studentId);
            return Student.findAll({ where: { id: studentIds } }).then(function (studenti) {
                var json = "{\"studenti\":" + JSON.stringify(studenti) + ",\"prisustva\":" + JSON.stringify(pris) + ",\"predmet\":\"" + naziv + "\",\"brojPredavanjaSedmicno\":" + predm.brojPredavanjaSedmicno + ",\"brojVjezbiSedmicno\":" + predm.brojVjezbiSedmicno + "}";
                res.send(json);
            });
        });
    }).catch(err => { console.log(err); });

});


app.post("/prisustvo/predmet/:naziv/student/:index", function (req, res) {
    var indeks = req.params.index;
    var nazivPredmeta = req.params.naziv;
    var student;
    Predmet.findOne({ where: { naziv: nazivPredmeta } }).then(function (predmet) {
        if (!predmet) return res.status(404).send({ error: "Predmet nije pronađen" });

        var predmetid = predmet.Id;
        Student.findOne({ where: { index: indeks } }).then(function (student) {
            Prisustvo.findOne({ where: { index: indeks, predmetId: predmet.id, sedmica: req.body.sedmica } }).then(function (prisustvo) {

                if (prisustvo) {
                    prisustvo.update({
                        predavanja: req.body.predavanja,
                        vjezbe: req.body.vjezbe
                    }).then(function (updatedPrisustvo) {
                        return res.send(updatedPrisustvo);
                    });
                } else {
                    Prisustvo.create({
                        studentId: student.id,
                        predmetId: predmet.id,
                        sedmica: req.body.sedmica,
                        predavanja: req.body.predavanja,
                        vjezbe: req.body.vjezbe,
                        index: student.index
                    }).then(function (createdPrisustvo) {
                        return res.send(createdPrisustvo);
                    });
                }
            });
        })

    });
});


app.listen(3000);
