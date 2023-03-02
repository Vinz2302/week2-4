const path = require('path');

const carsService = require(path.resolve('app/cars/services/cars_service'))
const Response = require(path.resolve('response/response'))

exports.getCars = async (req, res) => {
    
    let page = req.query.page ? req.query.page : 0;
    let limit = req.query.limit ? req.query.limit : 10;

    try{
        
        let data = await carsService.getCars(page, limit)
        .then(response => {
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

exports.getCarsById = async (req, res) => {

    try{
        let id = req.params.id;
        let result = await carsService.getCarsById(id)
        return res.status(200).json(Response.list(result));
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

exports.createCars = async (req, res) => {
    try{
        let data = req.body;
        let result = await carsService.createCars(data)
        .then(() => res.status(200).json(Response.created('Cars')));
        return result;
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

exports.updateCars = async (req, res) => {
    try{
        let data = req.body;
        let result = await carsService.updateCars(data)
        .then(() => res.status(200).json(Response.updated('Cars')));
        return result;
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

exports.deleteCars = async (req, res) => {
    try{
        let id = req.params.id;
        let result = await carsService.deleteCars(id)
        .then(() => res.status(200).json(Response.deleted('Cars')));
        return result;
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}