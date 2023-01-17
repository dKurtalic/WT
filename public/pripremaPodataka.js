/*const db = require("./db");
db.sequelize.sync({ force: true }).then(function () {
    inicializacija().then(function () {
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});
function inicializacija() {
    var student1, student2, student3, student4;
    var studentiListaPromisea = [];
    var prisustvaListaPromisea = [];
    var predmetiListaPromisea = [];
    var nastavniciListaPromisea = [];

    return new Promise(function (resolve, reject) {
        nastavniciListaPromisea.push(db.nastavnik.create({ username: "USERNAME", password_hash: "$2b$10$A5c5vlRxGGK3ZrNyhDUjGuzmaki5.vfDlVCxG764r0fDNOsmcb1Aq" }));
        nastavniciListaPromisea.push(db.nastavnik.create({ username: "USERNAME2", password_hash: "$2b$10$7VxukU1JzfQq6Pdy00eRbOmS1fGZxieIaEBILRQdmioITngzwOZvW" }));

        Promise.all(nastavniciListaPromisea).then(function (nastavnici) {
            var nastavnik1 = nastavnici.filter(function (n) { return n.username == "USERNAME" })[0];
            var nastavnik2 = nastavnici.filter(function (n) { return n.username == "USERNAME2" })[0];

            predmetiListaPromisea.push(
                db.predmet.create({ naziv: "PREDMET1", brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 2 }).then(function (p) {
                    return p.setNastavnici([nastavnik1, nastavnik2]).then(function () {
                        return new Promise(function (resolve, reject) { resolve(p) });
                    });

                })
            );
            predmetiListaPromisea.push(
                db.predmet.create({ naziv: "PREDMET2", brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 2 }).then(function (p) {
                    return p.setNastavnici([nastavnik1]).then(function () {
                        return new Promise(function (resolve, reject) { resolve(p) });
                    });

                })
            );
            predmetiListaPromisea.push(
                db.predmet.create({ naziv: "PREDMET3", brojPredavanjaSedmicno: 3, brojVjezbiSedmicno: 2 }).then(function (p) {
                    p.setNastavnici([nastavnik1]);
                    return new Promise(function (resolve, reject) { resolve(p) });
                })
            );
            Promise.all(predmetiListaPromisea).then(function (predmeti) {


                var predmet1 = predmeti.filter(function (p) { return p.naziv == "PREDMET1" })[0];
                var predmet2 = predmeti.filter(function (p) { return p.naziv == "PREDMET2" })[0];
                var predmet3 = predmeti.filter(function (p) { return p.naziv == "PREDMET3" })[0];
                console.log("jel ok predmet1 : " + predmet1.naziv + ", " + predmet1.id);
                var id1 = predmet1.id;
                var id2 = predmet2.id;
                var id3 = predmet3.id;
                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 1, predavanja: 1, vjezbe: 1, index: 12345, predmetId: id1 }).then(function (p) {
                        return predmet1.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 1 id " + id1);
                            return new Promise(function (resolve, reject) { resolve(p) });
                        });

                    }
                    )
                );

                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 2, predavanja: 2, vjezbe: 2, index: 12345, predmetId: id1 }).then(function (p) {
                        return predmet1.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 1 id " + id1);

                            return new Promise(function (resolve, reject) { resolve(p) });
                        });

                    }
                    )
                );
                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 3, predavanja: 1, vjezbe: 2, index: 12345, predmetId: id1 }).then(function (p) {
                        return new predmet1.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 1 id " + id1);

                            return new Promise(function (resolve, reject) { resolve(p) });
                        });

                    }
                    )
                );
                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 1, predavanja: 2, vjezbe: 1, index: 12346, predmetId: id1 }).then(function (p) {
                        return predmet1.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 1 id " + id1);

                            return new Promise(function (resolve, reject) { resolve(p) });
                        });

                    }
                    )
                );
                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 2, predavanja: 2, vjezbe: 2, index: 12346, predmetId: id1 }).then(function (p) {
                        return predmet1.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 1 id " + id1);

                            return new Promise(function (resolve, reject) { resolve(p) });
                        });

                    }
                    )
                );
                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 1, predavanja: 0, vjezbe: 2, index: 12347, predmetId: id1 }).then(function (p) {
                        return predmet1.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 1 id " + id1);

                            return new Promise(function (resolve, reject) { resolve(p) });
                        });

                    }
                    )
                );
                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 2, predavanja: 1, vjezbe: 1, index: 12347, predmetId: id1 }, { logging: console.log }).then(function (p) {
                        return predmet1.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 1 id " + id1);

                            return new Promise(function (resolve, reject) { resolve(p) });
                        });

                    }
                    )
                );



                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 1, predavanja: 1, vjezbe: 1, index: 12345, predmetId: id2 }).then(function (p) {
                        return predmet2.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 2 id " + id2);
                            return new Promise(function (resolve, reject) { resolve(p) });
                        });

                    }
                    )
                );
                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 2, predavanja: 2, vjezbe: 2, index: 12345, predmetId: id2 }).then(function (p) {
                        return predmet2.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 2 id " + id2);

                            return new Promise(function (resolve, reject) { resolve(p) });

                        });

                    }
                    )
                );
                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 3, predavanja: 0, vjezbe: 0, index: 12345, predmetId: id2 }).then(function (p) {
                        return predmet2.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 2 id " + id2);

                            return new Promise(function (resolve, reject) { resolve(p) });
                        });

                    }
                    )
                );
                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 1, predavanja: 1, vjezbe: 0, index: 12346, predmetId: id2 }).then(function (p) {
                        return predmet2.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 2 id " + id2);

                            return new Promise(function (resolve, reject) { resolve(p) });
                        });

                    }
                    )
                );
                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 2, predavanja: 0, vjezbe: 0, index: 12346, predmetId: id2 }).then(function (p) {
                        return predmet2.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 2 id " + id2);

                            return new Promise(function (resolve, reject) { resolve(p) });
                        });
                    }
                    )
                );
                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 1, predavanja: 1, vjezbe: 0, index: 12347, predmetId: id2 }).then(function (p) {
                        return predmet2.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 2 id " + id2);

                            return new Promise(function (resolve, reject) { resolve(p) });
                        });

                    }
                    )
                );
                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 2, predavanja: 0, vjezbe: 0, index: 12347, predmetId: id2 }).then(function (p) {
                        return predmet2.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 2 id " + id2);

                            return new Promise(function (resolve, reject) { resolve(p) });
                        });

                    }
                    )
                );
                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 3, predavanja: 1, vjezbe: 0, index: 12347, predmetId: id2 }).then(function (p) {
                        return predmet2.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 2 id " + id2);

                            return new Promise(function (resolve, reject) { resolve(p) });
                        });

                    }
                    )
                );

                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 1, predavanja: 1, vjezbe: 0, index: 12346, predmetId: id3 }).then(function (p) {
                        return predmet3.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 3 id " + id3);

                            return new Promise(function (resolve, reject) { resolve(p) });
                        });

                    }
                    )
                );
                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 2, predavanja: 2, vjezbe: 1, index: 12346, predmetId: id3 }).then(function (p) {
                        return predmet3.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 3 id " + id3);

                            return new Promise(function (resolve, reject) { resolve(p) });
                        });

                    }
                    )
                );
                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 1, predavanja: 1, vjezbe: 0, index: 12345, predmetId: id3 }).then(function (p) {
                        return predmet3.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 3 id " + id3);

                            return new Promise(function (resolve, reject) { resolve(p) });
                        });

                    }
                    )
                );
                prisustvaListaPromisea.push(
                    db.prisustvo.create({ sedmica: 2, predavanja: 2, vjezbe: 1, index: 12345, predmetId: id3 }).then(function (p) {
                        return predmet3.setPrisustvaNaPredmetu(p).then(function () {
                            console.log("Predmet 3 id " + id3);
                            return new Promise(function (resolve, reject) { resolve(p) });
                        });

                    }
                    )

                );
                console.log(2);
                Promise.all(prisustvaListaPromisea).then(function (prisustva) {

                    console.log(3);
                    var dinina = prisustva.filter(function (a) { return a.index == 12345 })[0];
                    var nekina = prisustva.filter(function (b) { return b.index == 12346 })[0];
                    var novina = prisustva.filter(function (c) { return c.index == 12347 })[0];
                    var alemova = prisustva.filter(function (d) { return d.index == 12348 })[0];

                    console.log("Dinina " + dinina + ", nekina " + nekina);
                    studentiListaPromisea.push(
                        db.student.create({ ime: "Dina", index: 12345 }).then(function (e) {
                            return e.setStudentovaPrisustva([dinina]).then(function () {
                                return new Promise(function (resolve, reject) { resolve(e) });
                            });

                        }));
                    studentiListaPromisea.push(
                        db.student.create({ ime: "Neko Nekić", index: 12346 }).then(function (f) {
                            return f.setStudentovaPrisustva([nekina]).then(function () {
                                return new Promise(function (resolve, reject) { resolve(f) });
                            });

                        }));
                    studentiListaPromisea.push(
                        db.student.create({ ime: "Novi", index: 12347 }).then(function (g) {
                            return g.setStudentovaPrisustva([novina]).then(function () {
                                return new Promise(function (resolve, reject) { resolve(g) });
                            });

                        }));
                    studentiListaPromisea.push(
                        db.student.create({ ime: "Alem", index: 12348 }).then(function (h) {
                            return h.setStudentovaPrisustva([alemova]).then(function () {
                                return new Promise(function (resolve, reject) { resolve(h) });

                            });
                        }));

                    Promise.all(studentiListaPromisea).then(function (l) { resolve(l) }).catch(function (error) { console.log("Greska pri upisivanju studenata"); });


                }).catch(function (error) { console.log("Greska pri dodjeljivanju prisustva studentu " + error); });
                console.log("ollaaaa");
            }).catch(function (error) { console.log("Greska pri unosu prisustva na predmet: " + error); });
        }).catch(function (error) { console.log("Greska pri unosu podataka o nastavnicima: " + error); });
    });





}
*/