const sequelize = require("../public/db");

const Nastavnik = require("./models/nastavnik")
const Student = require("./models/student")
const Predmet = require("./models/predmet")
const Prisustvo = require("./models/prisustvo")

Nastavnik.hasMany(Predmet);
Predmet.belongsTo(Nastavnik);
Student.hasMany(Prisustvo);
Predmet.hasMany(Prisustvo);

const createNastavniks = async () => {
    await Nastavnik.bulkCreate([
        {
            username: "USERNAME",
            password_hash: "$2b$10$SYThyofNfb8J4/7v0O0MZOEh5sWEmA7qaKrUJ3fUOrT.MknZJ1Ee."
        },
        {
            username: "USERNAME2",
            password_hash: "$2b$10$IoYBDTIwNh/bk6mjlKTCL.efmIBEsaqGGhf6pRkPOHKmSA2dRrowC"
        }
    ]);
}

const createPredmets = async () => {
    await Predmet.bulkCreate([
        {
            naziv: "PREDMET1",
            brojPredavanjaSedmicno: 3,
            brojVjezbiSedmicno: 2,
            nastavnikId: 1
        },
        {
            naziv: "PREDMET2",
            brojPredavanjaSedmicno: 3,
            brojVjezbiSedmicno: 2,
            nastavnikId: 1
        }
    ]);
    const predmet3 = await Predmet.create({
        naziv: "PREDMET3",
        brojPredavanjaSedmicno: 3,
        brojVjezbiSedmicno: 2
    });
    const nastavnik = await Nastavnik.findOne({ where: { username: "USERNAME2" } });
    await predmet3.setNastavnik(nastavnik);

}

const createStudents = async () => {
    await Student.bulkCreate([
        { ime: "Dina Dinci", index: 12345 },
        { ime: "Alem Alemko", index: 12346 },
        { ime: "Mama Mamic", index: 12347 },
        { ime: "Tata Tatic", index: 12348 }
    ]);
    let student = await Student.findOne({ where: { ime: "Dina Dinci" } });
    let predmet = await Predmet.findOne({ where: { naziv: "PREDMET1" } });
    await Prisustvo.bulkCreate([
        { sedmica: 1, predavanja: 2, vjezbe: 2, index: student.index, predmetId: predmet.id, studentId: student.id },
        { sedmica: 2, predavanja: 2, vjezbe: 0, index: student.index, predmetId: predmet.id, studentId: student.id },
        { sedmica: 3, predavanja: 1, vjezbe: 0, index: student.index, predmetId: predmet.id, studentId: student.id }
    ]);
    student = await Student.findOne({ where: { ime: "Alem Alemko" } });
    await Prisustvo.bulkCreate([
        { sedmica: 1, predavanja: 3, vjezbe: 2, index: student.index, predmetId: predmet.id, studentId: student.id },
        { sedmica: 2, predavanja: 2, vjezbe: 1, index: student.index, predmetId: predmet.id, studentId: student.id },
        { sedmica: 3, predavanja: 1, vjezbe: 0, index: student.index, predmetId: predmet.id, studentId: student.id }
    ]);
}
const createPrisustvaForPredmet2 = async () => {
    let student = await Student.findOne({ where: { ime: "Dina Dinci" } });
    let predmet = await Predmet.findOne({ where: { naziv: "PREDMET2" } });
    await Prisustvo.bulkCreate([
        { sedmica: 1, predavanja: 2, vjezbe: 2, index: student.index, predmetId: predmet.id, studentId: student.id },
        { sedmica: 2, predavanja: 2, vjezbe: 0, index: student.index, predmetId: predmet.id, studentId: student.id },
        { sedmica: 3, predavanja: 1, vjezbe: 0, index: student.index, predmetId: predmet.id, studentId: student.id }
    ]);
    student = await Student.findOne({ where: { ime: "Alem Alemko" } });
    await Prisustvo.bulkCreate([
        { sedmica: 1, predavanja: 1, vjezbe: 2, index: student.index, predmetId: predmet.id, studentId: student.id },
        { sedmica: 2, predavanja: 1, vjezbe: 0, index: student.index, predmetId: predmet.id, studentId: student.id },

    ]);

}
const createPrisustvaForPredmet3 = async () => {
    var student = await Student.findOne({ where: { ime: "Mama Mamic" } });
    var predmet = await Predmet.findOne({ where: { naziv: "PREDMET3" } });
    await Prisustvo.bulkCreate([
        { sedmica: 1, predavanja: 2, vjezbe: 2, index: student.index, predmetId: 3, studentId: student.id },
        { sedmica: 2, predavanja: 2, vjezbe: 0, index: student.index, predmetId: 3, studentId: student.id },
        { sedmica: 3, predavanja: 3, vjezbe: 2, index: student.index, predmetId: 3, studentId: student.id }
    ]);
    student = await Student.findOne({ where: { ime: "Tata Tatic" } });
    await Prisustvo.bulkCreate([
        { sedmica: 1, predavanja: 1, vjezbe: 2, index: student.index, predmetId: 3, studentId: student.id },
        { sedmica: 2, predavanja: 0, vjezbe: 0, index: student.index, predmetId: 3, studentId: student.id },
        { sedmica: 3, predavanja: 0, vjezbe: 0, index: student.index, predmetId: 3, studentId: student.id },
        { sedmica: 4, predavanja: 2, vjezbe: 0, index: student.index, predmetId: 3, studentId: student.id }

    ]);

}

sequelize.sync({ force: true }).then(() => {
    createNastavniks();
    createPredmets();
    createPrisustvaForPredmet2();
    createPrisustvaForPredmet3();
    createStudents();
});

