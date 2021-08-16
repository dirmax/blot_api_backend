const schedule = require('node-schedule')
const request = require('request-json');
const vehicleModel = require('../orm/model/vehicle');
const vehiclePositionModel = require('../orm/model/vehiclePosition');

const clientHttp = request.createClient('https://rental-search.bolt.eu/');
clientHttp.setBasicAuth(process.env.API_AUTH_USERNAME, process.env.API_AUTH_PASSWORD);

schedule.scheduleJob('* * * * *', () => {
    const lat = 52.243579;
    const lng = 21.018335;

    clientHttp.get('categoriesOverview/?deviceType=iphone&lat=' + lat + '&gps_lng=' + lng + '&version=CI.26.1&device_os_version=iOS14.6&language=ru&device_name=iPhone12,3&deviceId=F6895050-69DD-4062-BEE1-8D8E0C3A1C27&gps_lat=' + lat +'&lng=' + lng, function(err, res, body) {
        const vehiclesAPI = body.data.categories[0].vehicles;
        const cityId = body.data.city_id;

        vehiclesAPI.forEach(item => {
            (async () => {
                let vehicle = await vehicleModel.findOne({ where: {
                    vehicle_id: item.id,
                    city_id: cityId
                }});

                if (!vehicle) {
                    vehicle = await vehicleModel.create({
                        vehicle_id: item.id,
                        city_id: cityId,
                        name: item.name,
                        type: item.type,
                    });
                }

                let lastVehiclePosition = await vehiclePositionModel.findOne({
                    where: {
                        vehicle: vehicle.vehicle_id,
                        charge: item.charge,
                    },
                    order: [['createdAt', 'DESC']]
                });

                if (lastVehiclePosition &&
                    (
                        Number(lastVehiclePosition.lat).toFixed(2) == item.lat.toFixed(2)
                        || Number(lastVehiclePosition.lng).toFixed(2) == item.lng.toFixed(2)
                        || lastVehiclePosition.charge == item.charge
                        || lastVehiclePosition.distance_on_charge == item.distance_on_charge
                    )
                ) {
                    lastVehiclePosition.lat = item.lat.toFixed(4);
                    lastVehiclePosition.lng = item.lng.toFixed(4);

                    await lastVehiclePosition.save();
                }

                if (!lastVehiclePosition) {
                    await vehiclePositionModel.create({
                        vehicle: vehicle.vehicle_id,
                        lat: item.lat.toFixed(4),
                        lng: item.lng.toFixed(4),
                        charge: item.charge,
                        distance_on_charge: item.distance_on_charge
                    });
                }
            })();
        })
    });
});







