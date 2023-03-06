const path = require('path');

const customerService = require(path.resolve('app/customer/services/customer_service'))
const Response = require(path.resolve('response/response'))
const { createSchema, updateSchema } = require(path.resolve('validator/customer_validator'))

exports.getCustomer = async (req, res) => {

    let page = req.query.page ? req.query.page : 0;
    let limit = req.query.limit ? req.query.limit : 10;

    try {
  
        let data = await customerService.getCustomer(page, limit)
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

exports.getCustomerById = async (req, res) => {

    try{
        let id = req.params.id;
        let result = await customerService.getCustomerById(id)
        return res.status(200).json(Response.list(result));
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}


exports.createCustomer = async (req, res) => {
    try{
        // let data = req.body;
        let data = await createSchema.validateAsync(req.body, {
            abortEarly: false,
        });
        let result = await customerService.createCustomer(data)
        .then(() => res.status(200).json(Response.created('Customer')));
        return result;
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

exports.updateCustomer = async (req, res) => {
    try{
        // let data = req.body;
        let data = await updateSchema.validateAsync(req.body, {
            abortEarly: false,
        });
        let result = await customerService.updateCustomer(data)
        .then(() => res.status(200).json(Response.updated('Customer')));
        return result;
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

exports.deleteCustomer = async (req, res) => {
    try{
        let id = req.params.id;
        let result = await customerService.deleteCustomer(id)
        .then(() => res.status (200).json(Response.deleted('Customer')));
        return result;
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }

}