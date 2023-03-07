const express = require('express');
const path = require('path');
require('express-group-routes');
var routers = require('express').Router();

const memberHandler = require(path.resolve('app/membership/handlers/member_handler'));

module.exports = app => {

    routers.group("/v1/member", (router) => {
        router.get('/', memberHandler.getMember);
    });
    app.use('/api')
}