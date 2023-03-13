const path = require('path');

const incentiveService = require(path.resolve('app/driver_incentive/services/incentive_service'));
const Response = require(path.resolve('response/response'));

exports.getIncentiveById = async (req, res) => {
    
    try{
        let id = req.params.id;
        let result = await incentiveService.getIncentiveById(id)
        return res.status(200).json(Response.list(result));
    }catch(err) {
        return res.status(500).json(Response.serverError(err));
    }
}