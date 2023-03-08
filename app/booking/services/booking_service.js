const { statSync } = require('fs');
const path = require ('path');
const bookingRepo = require(path.resolve('app/Booking/repositories/booking_repositories'))

// logic
exports.getBooking = async (page, limit) => {
    try{
        var page = page == 0 ? 0 : page - 1;
        let skip = page * limit;
        let data = await bookingRepo.getBooking(skip, limit);
        return data;
    }catch(err){
        throw new Error(err);
    }
}

exports.getBookingById = async (id) => {
    try{
        var result = await bookingRepo.getBookingById(id);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.createBooking = async (data) => {

    try{

        startTime = data.start_time.getTime();
        endTime = data.end_time.getTime();
        range = (endTime - startTime) / (1000 * 3600 * 24);
        if (range < 0) throw "invalid date";

        total_cost = range*data.rent_daily_price

        total_driver_cost = range*data.driverCost

        discount = total_cost*data.membershipValue

        let result = await bookingRepo.createBooking(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.updateBooking = async (data) => {

    try{

        startTime = data.start_time.getTime();
        endTime = data.end_time.getTime();
        range = (endTime - startTime) / (1000 * 3600 * 24);
        if (range < 0) throw "invalid date";

        console.log(range)

        let carId = data.cars_id
        let customerId = data.customer_id
        //console.log(carId,customerId)

        let result = await bookingRepo.updateBooking(data);
            
        return [result, carId, customerId];
    }catch(err){
        throw new Error(err);
    }
}

exports.deleteBooking = async (id) => {
    try{
        let result = await bookingRepo.deleteBooking(id);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.carId = async (data) => {
    try{
        let carId = data;
        return carId;
    }catch(err){
        throw new Error(err);
    }
}

exports.customerId = async (data) => {
    console.log(data)
    try{
        let customerId = data;
        return customerId;
    }catch(err){
        throw new Error(err);
    }
}