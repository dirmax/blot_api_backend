const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL, {
    dialect: "mysql",
    dialectOptions: {
        connectTimeout: 60000
    }
});

module.exports = sequelize;
