const path = require('path');

const bookingService = require(path.resolve('app/booking/services/booking_service'))
const Response = require(path.resolve('response/response'))

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
        console.log(id)
        let result = await bookingService.getBookingById(id)
        return res.status(200).json(Response.list(result));
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}


exports.createBooking = async (req, res) => {
    try{
        let data = req.body;
        let result = await bookingService.createBooking(data)
        .then(() => res.status(200).json(Response.created('booking')));
        return result;
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

exports.updateBooking = async (req, res) => {
    try{
        let data = req.body;
        let result = await bookingService.updateBooking(data)
        .then(() => res.status(200).json(Response.updated('booking')));
        return result;
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

exports.deleteBooking = async (req, res) => {
    try{
        let data = req.body;
        let result = await bookingService.deleteBooking(data)
        .then(() => res.status (200).json(Response.deleted('booking')));
        return result;
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }

}