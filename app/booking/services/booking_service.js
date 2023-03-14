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

exports.getBookingByDriver = async (id) => {
    try{
        var result = await bookingRepo.getBookingByDriver(id);
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
        range = range + 1;
        if (range < 0) throw "invalid date";

        total_cost = range*data.rent_daily_price

        total_driver_cost = range*data.driverCost

        data.membership = data.membership || 0
        
        discount = total_cost*data.membershipValue
        discount = discount || 0

        driver_incentive = total_cost*0.05

        // console.log(discount);
        // console.log(total_driver_cost);
        // console.log(total_cost)
        // console.log(driver_incentive)
        // console.log(data.booktype_id);
        if (data.booktype_id === 1) {
             total_driver_cost = 0
             driver_incentive = 0
        }
        // console.log(total_driver_cost);
        // console.log(driver_incentive);
        //console.log(data)

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
        range = range + 1;
        if (range <= 0) throw "invalid date";

        total_cost = range*data.rent_daily_price

        total_driver_cost = range*data.driverCost

        data.membership = data.membership || 0

        discount = total_cost*data.membershipValue
        discount = discount || 0

        driver_incentive = total_cost*0.05

        console.log(total_cost, total_driver_cost, discount)
        //console.log(data.previousCar);

        let result = await bookingRepo.updateBooking(data);
        return result;
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