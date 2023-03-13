const express = require('express');
const path = require('path');
require('express-group-routes');
var routers = require('express').Router();

const incentiveHandler = require(path.resolve('app/driver_incentive/handlers/incentive_handler'));

module.exports = app => {

    routers.group("/v1/incentive", (router) => {
        router.get('/:id', incentiveHandler.getIncentiveById);
    });
    app.use('/api', routers)
}