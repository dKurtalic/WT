const Sequelize = require("sequelize");
const sequelize = require("../db");

const Prisustvo = sequelize.define("prisustvo", {
    sedmica: Sequelize.INTEGER,
    predavanja: Sequelize.INTEGER,
    vjezbe: Sequelize.INTEGER,
    index: Sequelize.INTEGER
})

module.exports = Prisustvo;

