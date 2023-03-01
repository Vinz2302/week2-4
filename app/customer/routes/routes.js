const express = require('express');
const path = require('path');
require('express-group-routes');
var routers = require('express').Router();

const customerHandler = require(path.resolve('app/customer/handlers/customer_handler'));

module.exports = app => {

    routers.group("/v1/customer", (router) => {
        router.get('/', customerHandler.getCustomer);
        router.get('/:id', customerHandler.getCustomerById);
        router.post('/create', customerHandler.createCustomer);
        router.put('/update', customerHandler.updateCustomer);
        router.delete('/delete/:id', customerHandler.deleteCustomer);
    });
    app.use('/api', routers);
};