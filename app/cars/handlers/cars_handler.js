const { response } = require('express');
const path = require('path');

const carsService = require(path.resolve('app/booking/services/cars_service'))
const Response = require(path.resolve('response/response'))

exports.getCars = async (req, res) => {
    try{
        let data = req.params.id;
        let result = await carsService.getCars(data)
        .then(() => res.status(200).json(response.created('Cars')));
        return result;
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}