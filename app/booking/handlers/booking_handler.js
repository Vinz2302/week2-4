const path = require('path');
const moment = require('moment');

const momentRange = require('moment-range');
const extendedMoment = momentRange.extendMoment(moment);

const bookingService = require(path.resolve('app/booking/services/booking_service'))
const Response = require(path.resolve('response/response'))
const bookingRepo = require(path.resolve('app/booking/repositories/booking_repositories'))
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

exports.getBookingByDriver = async (req, res) => {

    try{
        let id = req.params.id;
        let result = await bookingService.getBookingByDriver(id)
        return res.status(200).json(Response.list(result));
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}


exports.createBooking = async (req, res) => {
    try{
        let data = await createSchema.validateAsync (req.body, {
            abortEarly: false,
        })
        let customer = await customerRepo.getCustomerById(data.customer_id)
        .then(response => {
            if (response == undefined) {
                const error = new Error()
                error.status = 404
                error.message = "Customer ID not Found"
                throw error
                //return res.status(404).json(Response.notFound('Customer id not found'))
            }

            data.membership = response.membership_id;
        })

        //let membership = await memberRepo.getMembership(data.membership)

        if (data.membership != null) {
            let membership = await memberRepo.getMembership(data.membership)
        .then(response => {
            if (response == null) {
                const error = new Error()
                error.status = 404
                error.message = "Membership not Found"
                throw error
            }
            data.membershipValue = response.daily_discount;
        })
        }
        
        let car = await carsRepo.getCarsById(data.cars_id)
        .then(response => {
            if (response == undefined) {
                const error = new Error()
                error.status = 404
                error.message = "Car ID not Found"
                throw error
            }
            if (response.stock == 0){
                const error = new Error()
                error.status = 400
                error.message = "Car out of stock"
                throw error
            }
            data.stock = response.stock
            data.rent_daily_price = response.rent_daily_price
        })
        

        let booking_data = await bookingRepo.getBookingByDriver(data.driver_id)
        .then(response => {

            if(response.length != 0){

            const startDate = moment(data.start_time)
            const endDate = moment(data.end_time)

            const range = extendedMoment.range(startDate, endDate);

            for (const date of range.by('day')) {
            //console.log('dateRequest', date.format('YYYY-MM-DD'));
            let requestDate = moment(date).format('YYYY-MM-DD')
            response.forEach( dates => {
            startDateBooking = moment(dates.start_time).format('YYYY-MM-DD')
            endDateBooking = moment(dates.end_time).format('YYYY-MM-DD')

                    const rangeBooking = extendedMoment.range(startDateBooking, endDateBooking);
                    for (let dateBooking of rangeBooking.by('day')){
                        dateBooking = moment(dateBooking).format('YYYY-MM-DD')
                        //console.log('date from booking', dateBooking);
                        if (requestDate === dateBooking) {
                            const error = new Error()
                            error.status = 400
                            error.message = "Driver not available on that day"
                            throw error
                        }
                    }
            })
            }
        }
        })


        let driver = await driverRepo.getDriverById(data.driver_id)
        .then(response => {
            if (response == null){
                const error = new Error()
                error.status = 404
                error.message = "Driver ID not Found"
                throw error
            }
            data.driverCost = response.daily_cost
        })

        //let booktype = await bookingRepo.getBookingById
        
        let result = await bookingService.createBooking(data)
        .then(() => res.status(200).json(Response.created('booking')));
        return result;
    }catch(err){
        if (err.status === 404){
            return res.status(404).json(Response.notFound(err.message));
        }
        if (err.status === 400){
            return res.status(400).json(Response.badRequest(err.message));
        }
        return res.status(500).json(Response.serverError(err));
    }
}

exports.updateBooking = async (req, res) => {
    try{
        let data = await updateSchema.validateAsync (req.body, {
            abortEarly: false,
        })

        let booking = await bookingRepo.getBookingById(data.id)
        .then(response => {
             if (response.finished == true){
                const error = new Error()
                error.status = 400
                error.message = "Booking has already finished"
                throw error
             }
             data.previousCar = response.cars_id;
        })

        let customer = await customerRepo.getCustomerById(data.customer_id)
        .then(response => {
            if (response == 0) {
                const error = new Error()
                error.status = 404
                error.message = "Customer ID not Found"
                throw error
            }

            data.membership = response.membership_id;
        })

        //let membership = await memberRepo.getMembership(data.membership)
        //data.membershipValue = membership.daily_discount;
        if (data.membership != null) {
        let membership = await memberRepo.getMembership(data.membership)
        .then(response => {
            if (response == null) {
                const error = new Error()
                error.status = 404
                error.message = "No membership applied"
                throw error
            }
            data.membershipValue = response.daily_discount;
        })
        }
        
        //check current stock
        let car = await carsRepo.getCarsById(data.cars_id)
        .then(response => {
            if (response == 0) {
                const error = new Error()
                error.status = 404
                error.message = "Car ID not Found"
                throw error
            }
            if (response.stock == 0){
                const error = new Error()
                error.status = 400
                error.message = "Cars out of stock"
                throw error
            }
            data.stock = response.stock
            data.rent_daily_price = response.rent_daily_price
        })

        let booking_data = await bookingRepo.getBookingByDriver(data.driver_id)
        .then(response => {
            if(response.length != 0){
                const startDate = moment(data.start_time)
                const endDate = moment(data.end_time)

                const range = extendedMoment.range(startDate, endDate);
                
                for(const date of range.by('day')){
                    let requestDate = moment(date).format('YYYY-MM-DD')
                    response.forEach( dates => {
                        startDateBooking = moment(dates.start_time).format('YYYY-MM-DD')
                        endDateBooking = moment(dates.end_time).format('YYYY-MM-DD')

                        const rangeBooking = extendedMoment.range(startDateBooking, endDateBooking);
                        for (let dateBooking of rangeBooking.by('day')){
                            dateBooking = moment(dateBooking).format('YYYY-MM-DD')
                            if(requestDate === dateBooking){
                                const error = new Error()
                                error.status = 400
                                error.message = "Driver not available on that day"
                                throw error
                            }
                        }
                    })
                }
            }
        })
        
        let driver = await driverRepo.getDriverById(data.driver_id)
        .then(response => {
            if (response ==null){
                const error = new Error()
                error.status = 404
                error.message = "Driver not Found"
                throw error
            }
            data.driverCost = response.daily_cost
        })

        let result = await bookingService.updateBooking(data)
        .then(() => res.status(200).json(Response.updated('booking')));
        return result;
    }catch(err){
        if (err.status === 404){
            return res.status(404).json(Response.notFound(err.message));
        }
        if (err.status === 400){
            return res.status(400).json(Response.badRequest(err.message));
        }
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