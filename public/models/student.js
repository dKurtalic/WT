const Sequelize = require("sequelize");
const sequelize = require("../db");

const Student = sequelize.define("student", {
    ime: Sequelize.STRING,
    index: Sequelize.INTEGER
})

module.exports = Student;
