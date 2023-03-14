const { response } = require('express');
const path = require ('path');
const ResponseClassList = require(path.resolve('response/baseResponseList'))
const ResponseClass = require(path.resolve('response/baseResponse'))

let responseReturn = new ResponseClass();

exports.list = (results) => {
    let responseReturn = new ResponseClassList();

    responseReturn.status = true;
    responseReturn.code = 200;
    responseReturn.message = "success";
    responseReturn.data = results;

    return responseReturn;
}

exports.created = (message) => {

    responseReturn.status = true;
    responseReturn.code = 200;
    responseReturn.message = `Data ${message} Created`;

    return responseReturn;
}

exports.updated = (message) => {

    responseReturn.status = true;
    responseReturn.code = 200;
    responseReturn.message = `Data ${message} Updated`;

    return responseReturn;
}

exports.deleted = (message) => {

    responseReturn.status = true;
    responseReturn.code = 200;
    responseReturn.message = `Data ${message} Deleted`;

    return responseReturn;
}

exports.serverError = (error) => {

    responseReturn.status = false;
    responseReturn.code = 500;
    responseReturn.message = error.message;

    return responseReturn;
}

exports.notFound = (message) => {
    
    responseReturn.status = false;
    responseReturn.code = 404;
    responseReturn.message = message;

    return responseReturn;
}

exports.badRequest = (message) => {

    responseReturn.status = false;
    responseReturn.code = 400;
    responseReturn.message = message;

    return responseReturn;
}