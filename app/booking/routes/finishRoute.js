const express = require('express');
const path = require('path');
require('express-group-routes');
var routers = require('express').Router();

const bookingHandler = require(path.resolve('app/booking/handlers/booking_handler'));

module.exports = app => {
    routers.group("/v1/finish", (router) => {
        router.post('/', bookingHandler.finishBooking);
    });
    app.use('/api', routers);
};