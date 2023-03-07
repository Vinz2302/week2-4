const express = require('express');
const path = require('path');
require('express-group-routes');
var routers = require('express').Router();

const driverHandler = require(path.resolve('app/driver/handlers/driver_handler'));

module.exports = app => {

    routers.group("/v1/driver", (router) => {
        router.get('/', driverHandler.getDriver);
        router.get('/:id', driverHandler.getDriverById);
        router.post('/create', driverHandler.createDriver);
        router.put('/update', driverHandler.updateDriver);
        router.delete('/delete/:id', driverHandler.deleteDriver);
    });
    app.use('/api', routers);
};