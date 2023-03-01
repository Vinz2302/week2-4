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
        let result = await bookingRepo.createBooking(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.updateBooking = async (data) => {
    try{
        let result = await bookingRepo.updateBooking(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.deleteBooking = async (data) => {
    try{
        let result = await bookingRepo.updateBooking(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}