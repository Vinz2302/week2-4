const path = require('path');

const bookingService = require(path.resolve('app/booking/services/booking_service'))
const Response = require(path.resolve('response/response'))
const carsRepo = require(path.resolve('app/cars/repositories/cars_repositories'))
const customerRepo = require(path.resolve('app/customer/repositories/customer_repositories'))
const driverRepo = require(path.resolve('app/driver/repositories/driver_repositories'))
const memberRepo = require(path.resolve('app/membership/repositories/member_repositories'))
const { createSchema, updateSchema } = require(path.resolve('validator/booking_validator'))

exports.getBooking = async (req, res) => {

    let page = req.query.page ? req.query.page : 0;
    let limit = req.query.limit ? req.query.limit : 10;

    try {
  
        let data = await bookingService.getBooking(page, limit)
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

exports.getBookingById = async (req, res) => {

    try{
        let id = req.params.id;
        let result = await bookingService.getBookingById(id)
        return res.status(200).json(Response.list(result));
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}


exports.createBooking = async (req, res) => {
    try{
        let data = await createSchema.validateAsync (req.body, {
            abortEarly: false,
        });
        let customer = await customerRepo.getCustomerById(data.customer_id)
        .then(response => {
            if (response == 0) {
                return res.status(404).json(Response.notFound('Customer id not found'))
            }

            data.membership = response.membership_id;
        })

        let membership = await memberRepo.getMembership(data.membership)
        .then(response => {
            if (response == null) {
                return res.status(404).json(Response.notFound('No membership applied'))
            }
            data.membershipValue = response.daily_discount;
        })
        
        
        let car = await carsRepo.getCarsById(data.cars_id)
        .then(response => {
            if (response == 0) {
                return res.status(404).json(Response.notFound('Car ID not found'))
            }
            if (response.stock == 0){
                return res.status(400).json(Response.badRequest('Cars out of stock'))
            }
            data.stock = response.stock
            data.rent_daily_price = response.rent_daily_price
        })
        
        let driver = await driverRepo.getDriverById(data.driver_id)
        .then(response => {
            if (response ==null){
                return res.status(404).json(Response.notFound('Book without driver'))
            }
            data.driverCost = response.daily_cost
        })
        
        let result = await bookingService.createBooking(data)
        .then(() => res.status(200).json(Response.created('booking')));
        return result;
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

exports.updateBooking = async (req, res) => {
    try{
        let data = await updateSchema.validateAsync (req.body, {
            abortEarly: false,
        })
        //console.log(data)
        let result = await bookingService.updateBooking(data)
        .then(() => res.status(200).json(Response.updated('booking')));
        return result;
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

exports.deleteBooking = async (req, res) => {
    try{
        let id = req.params.id;
        let result = await bookingService.deleteBooking(id)
        .then(() => res.status (200).json(Response.deleted('booking')));
        return result;
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }

}