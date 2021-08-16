const sequelize = require('../sequelize');
const vehicle = require('./vehicle');
const { Model, DataTypes } = require('sequelize');

class vehiclePosition extends Model {}
vehiclePosition.init({
    vehicle: {
        type: DataTypes.BIGINT,
        references: {
            model: vehicle,
            key: 'vehicle_id',
        }
    },
    lat: DataTypes.DECIMAL(6, 4),
    lng: DataTypes.DECIMAL(6, 4),
    charge: DataTypes.BIGINT,
    distance_on_charge: DataTypes.BIGINT
}, { sequelize, modelName: 'vehicle_position' });

(async () => {
    await sequelize.sync();
})();

module.exports = vehiclePosition;
