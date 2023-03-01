const express = require('express');
const path = require('path');
require('express-group-routes');
var routers = require('express').Router();

const bookingHandler = require(path.resolve('app/booking/handlers/booking_handler'));

module.exports = app => {
    routers.group("/v1/booking", (router) => {
        router.get('/', bookingHandler.getBooking);
        router.get('/:id', bookingHandler.getBookingById);
        router.post('/create', bookingHandler.createBooking);
        router.put('/update', bookingHandler.updateBooking);
        router.delete('/delete/:id', bookingHandler.deleteBooking);
    });
    app.use('/api', routers);
};