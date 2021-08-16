const sequelize = require('../sequelize');
const { Model, DataTypes } = require('sequelize');

class vehicle extends Model {}
vehicle.init({
    vehicle_id: { type: DataTypes.BIGINT, unique: 'vehicle_id' },
    city_id: { type: DataTypes.BIGINT, unique: 'vehicle_id' },
    name: DataTypes.STRING,
    type: DataTypes.ENUM('scooter'),
}, { sequelize, modelName: 'vehicle' });

(async () => {
    await sequelize.sync({ alter: true });
})();

module.exports = vehicle;
