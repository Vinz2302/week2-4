const path = require('path');

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
        });
        let customer = await customerRepo.getCustomerById(data.customer_id)
        .then(response => {
            if (response == 0) {
                return res.status(404).json(Response.notFound('Customer id not found'))
            }

            data.membership = response.membership_id;
        })

        //let membership = await memberRepo.getMembership(data.membership)

        if (data.membership != null) {
            let membership = await memberRepo.getMembership(data.membership)
        .then(response => {
            if (response == null) {
                return res.status(404).json(Response.notFound('No membership applied'))
            }
            data.membershipValue = response.daily_discount;
        })
        }
        
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

        let booking_data = await bookingRepo.getBookingByDriver(data.driver_id)
        .then(response => {

            var newStartDate = data.start_time
            var newEndDate = data.end_time

            // data from  booking table
            let allDates = [];
            response.forEach( dates => {
                allDates.push(
                    dates.start_time,dates.end_time
                )
            })

            // data from user input
            let bookData = [];
            [data].forEach(dates => 
                bookData.push(
                    dates.start_time,dates.end_time
                )
            )

            let pairs = allDates.map((val, i) => (i % 2 === 0 ? allDates.slice(i, i + 2) : null)).filter(Boolean);
        
            let bookedRange = [];
            for (let i = 0; i < pairs.length; i++){
                //console.log(pairs[i].)
                //allBooked.setDate(pairs[i])
                while (pairs[i][0] <= pairs[i][1]){
                    pairs[i][0].setDate(pairs[i][0].getDate()+1)
                    bookedRange.push(pairs[i][0].toISOString());
                }
            }

            let currentStartDate = new Date(newStartDate.getTime());
            const currentRange = [];
            while (currentStartDate.getTime() <= newEndDate.getTime()){

                currentRange.push(currentStartDate.toISOString());
                currentStartDate.setDate(currentStartDate.getDate()+1);
            }
            
            /* for (i = newStartDate; i < newEndDate; i++){
                while()
            } */

            let isContains = currentRange.some(item => bookedRange.includes(item))
            if (isContains == true){
                console.log(isContains);
                return res.status(400).json(Response.badRequest('Driver Not Available'))
            }
        })

        /* console.log(booking_data)
        for (i=0; i < booking_data.length; i++){
            console.log(booking_data[i].id)
        }
 */
        

        /* while (newStartDate <= newEndDate){
            //console.log(newStartDate.toISOString());
            newStartDate.setDate(newStartDate.getDate()+1)
            currentRange.push(newStartDate.toISOString());
        }

        /* let bookedRange = [];
        pairs.forEach(pair => {
            let startDate = pair[0];
            const endDate = pair[1];
  
            while (startDate <= endDate) {
                bookedRange.push(startDate.toISOString());
                startDate = new Date(startDate.getTime() + 86400000);
            }
        }); */


        /* let driver = await driverRepo.getDriverById(data.driver_id)
        .then(response => {
            if (response == null){
                return res.status(404).json(Response.notFound('Book without driver'))
            }
            data.driverCost = response.daily_cost
        })
        
        let result = await bookingService.createBooking(data)
        .then(() => res.status(200).json(Response.created('booking')));
        return result; */
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

exports.updateBooking = async (req, res) => {
    try{
        let data = await updateSchema.validateAsync (req.body, {
            abortEarly: false,
        })

        let customer = await customerRepo.getCustomerById(data.customer_id)
        .then(response => {
            if (response == 0) {
                return res.status(404).json(Response.notFound('Customer id not found'))
            }

            data.membership = response.membership_id;
        })

        //let membership = await memberRepo.getMembership(data.membership)
        //data.membershipValue = membership.daily_discount;
        if (data.membership != null) {
            let membership = await memberRepo.getMembership(data.membership)
        .then(response => {
            if (response == null) {
                return res.status(404).json(Response.notFound('No membership applied'))
            }
            data.membershipValue = response.daily_discount;
        })
        }
        
        
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