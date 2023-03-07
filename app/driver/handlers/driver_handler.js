const path = require('path');

const driverService = require(path.resolve('app/driver/services/driver_service'))
const Response = require(path.resolve('response/response'))
const { createSchema, updateSchema } = require(path.resolve('validator/driver_validator'))

exports.getDriver = async (req, res) => {

    let page = req.query.page ? req.query.page : 0;
    let limit = req.query.limit ? req.query.limit : 10;

    try {
  
        let data = await driverService.getDriver(page, limit)
        .then(response =>{
            if(response == 0){
                return res.status(404).json(Response.notFound("Data not Found"));
            }
            result = Response.list(response)
            return res.status(200).json(result);

        });

        return data;

    }catch(err){

        return res.status(500).json(Response.serverError(err));
    }
}

exports.getDriverById = async (req, res) => {

    try{
        let id = req.params.id;
        let result = await driverService.getDriverById(id)
        return res.status(200).json(Response.list(result));
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}


exports.createDriver = async (req, res) => {
    try{
        // let data = req.body;
        let data = await createSchema.validateAsync(req.body, {
            abortEarly: false,
        });
        let result = await driverService.createDriver(data)
        .then(() => res.status(200).json(Response.created('Driver')));
        return result;
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

exports.updateDriver = async (req, res) => {
    try{
        // let data = req.body;
        let data = await updateSchema.validateAsync(req.body, {
            abortEarly: false,
        });
        let result = await driverService.updateDriver(data)
        .then(() => res.status(200).json(Response.updated('Driver')));
        return result;
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

exports.deleteDriver = async (req, res) => {
    try{
        let id = req.params.id;
        let result = await driverService.deleteDriver(id)
        .then(() => res.status (200).json(Response.deleted('Driver')));
        return result;
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }

}