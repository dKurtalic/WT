const Sequelize = require("sequelize");
const sequelize = require("../db");

const Nastavnik = sequelize.define("nastavnik", {
    username: Sequelize.STRING,
    password_hash: Sequelize.STRING

});
module.exports = Nastavnik;
