//const { response } = require('express');
const path = require ('path');
const ResponseClassList = require(path.resolve('response/baseResponseList'))
const ResponseClass = require(path.resolve('response/baseResponse'))
//const ResponseData = require(path.resolve('response/dataResponse'))
const responseData = require(path.resolve('app/monthly_report/model/model'))

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

exports.forbidden = (message) => {
    responseReturn.status = false;
    responseReturn.code = 403;
    responseReturn.message = message;

    return responseReturn;
}

exports.getDriverIncentive = (result) => {
    let responseReturn = new ResponseClassList();

    responseReturn.status = true;
    responseReturn.code = 200;
    responseReturn.message = "success";
    responseReturn.data = "received"
    //responseReturn.Total = `Total Driver Incentive : ${result}`;
    responseReturn.Total_Driver_Incentive = result;

    return responseReturn;
}

exports.getDriverExpense = (result) => {
    let responseReturn = new ResponseData();

    responseReturn.status = true;
    responseReturn.code = 200;
    responseReturn.Total_Driver_Expense = result;

    return responseReturn;
}

exports.responseData = (results) => {
    let responseReturn = new responseData();

    //responseReturn.status = true;
    //responseReturn.code = 200;

    responseReturn.status = true;
    responseReturn.code = 200;
    responseReturn.data = results;
    
    //responseReturn.total_driver_cost = result.totalDriverCost
    //responseReturn.total_driver_incentive = result.totalDriverIncentive
    //responseReturn.total_driver_expense = result.totalDriverExpense
    //responseReturn.total_gross_income = result.totalGrossIncome
    //responseReturn.total_nett_income = result.totalNettIncome

    return responseReturn;
}