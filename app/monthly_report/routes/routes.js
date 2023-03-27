const express = require('express');
const path = require('path');
require('express-group-routes');
var routers = require('express').Router();

const reportHandler = require(path.resolve('app/monthly_report/handlers/report_handler'));

module.exports = app => {
    routers.group("/v1/report", (router) => {
        router.get('/monthlyreport', reportHandler.monthlyIncome);
        router.get('/bookingactivity', reportHandler.bookingActivity);
        router.get('/driveractivity', reportHandler.driverActivity);
        //router.get('/totaldrivercost/:year/:month', reportHandler.totalDriverCost);
        //router.get('/totaldriverincentive/:year/:month', reportHandler.totalDriverIncentive);

    });
    app.use('/api', routers);
};