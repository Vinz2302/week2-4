const express = require('express');
const path = require('path');
require('express-group-routes');
var routers = require('express').Router();

const carsHandler = require(path.resolve('app/cars/handlers/cars_handler'));

module.exports = app => {

    routers.group("/v1/cars", (router) => {
        router.get('/', carsHandler.getCars);
        router.get('/:id', carsHandler.getCarsById);
        router.post('/create', carsHandler.createCars);
        router.put('/update', carsHandler.updateCars);
        router.delete('/delete', carsHandler.deleteCars);
    });
    app.use('/api', routers);
};