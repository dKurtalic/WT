const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt22", "root", "password", {
    host: "127.0.0.1", dialect: "mysql", logging: false,
    define: {
        timestamps: false
    }
});

module.exports = sequelize;