const path = require('path');
const reportService = require(path.resolve('app/monthly_report/services/report_service'))
const Response = require(path.resolve('response/response'))
//const responseData = require(path.resolve('app/monthly_report/model/model'))

const reportRepo = require(path.resolve('app/monthly_report/repositories/report_repositories'))

exports.monthlyIncome = async (req, res) => {
    try{
        let data = {
            year: parseInt(req.query.year),
            month: parseInt(req.query.month)
        }

        let totalDriverCost = await reportRepo.totalDriverCost(data)
        .then(response => {
            data.totalDriverCost = parseInt(response[0]['total_driver_cost']);
        })

        let totalDriverIncentive = await reportRepo.totalDriverIncentive(data)
        .then(response => {
            data.totalDriverIncentive = response.reduce((acc, curr) => acc+ parseInt(curr.total_driver_incentive), 0);
            
        })

        let getTotalCostDiscount = await reportRepo.getTotalCostDiscount(data)
        .then(response => {
            console.log(response);
            data.totalCost = parseInt(response[0]['total_cost']);
            data.discount = parseInt(response[0]['discount']);
        })

        let result = await reportService.monthlyReport(data)
        console.log(result);
        //return res.status(200).json(responseData(result));
        return res.status(200).json(Response.responseData(result));
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

/* exports.totalDriverCost = async (req, res) => {
    try{
        let data = {
            year: parseInt(req.params.year),
            month: parseInt(req.params.month)
        }
        console.log(data);

        let result = await reportService.totalDriverCost(data)
        return res.status(200).json(Response.list(result));
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
} */

/* exports.totalDriverIncentive = async (req, res) => {
    try{
        let data= {
            year: parseInt(req.params.year),
            month: parseInt(req.params.month)
        }

        let driverIncentive = await reportService.totalDriverIncentive(data)

        let totalDriverIncentive = driverIncentive.reduce((acc, curr) => acc + parseInt(curr.total_driver_incentive), 0);

        let result = `total_driver_incentive = ${totalDriverIncentive}`

        return res.status(200).json(Response.list(result));
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
} */

exports.bookingActivity = async (req, res) => {
    try{
        let data= {
            year: parseInt(req.query.year),
            month: parseInt(req.query.month)
        }

        let bookingActivity = await reportRepo.getBookingActivity(data)
        .then(response => {
            console.log(response);
        })

        let result = await reportService.bookingActivity(data)
        return res.status(200).json(Response.list(result))
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

exports.driverActivity = async (req, res) => {
    try{
        let data = {
            year: parseInt(req.query.year),
            month: parseInt(req.query.month)
        }
        let result = await reportService.driverActivity(data)
        return res.status(200).json(Response.list(result))
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}