const Sequelize = require("sequelize");
const sequelize = require("../db");

const Predmet = sequelize.define("predmet", {
    naziv: Sequelize.STRING,
    brojPredavanjaSedmicno: Sequelize.INTEGER,
    brojVjezbiSedmicno: Sequelize.INTEGER

});

module.exports = Predmet;