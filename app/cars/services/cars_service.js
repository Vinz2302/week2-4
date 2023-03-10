const path = require ('path');
const carsRepo = require(path.resolve('app/cars/repositories/cars_repositories'))
const bookingService = require(path.resolve('app/booking/services/booking_service'))

exports.getCars = async (page, limit) => {
    try{
        var page = page == 0 ? 0 : page - 1;
        let skip = page * limit;
        let data = await carsRepo.getCars(skip, limit);
        return data;
    }catch(err){
        throw new Error(err);
    }
}

exports.getCarsById = async (id) => {
    try{
        let result = await carsRepo.getCarsById(id);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.createCars = async (data) => {
    try{
        let result = await carsRepo.createCars(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.updateCars = async (data) => {
    try{
        let result = await carsRepo.updateCars(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.deleteCars = async (id) => {
    try{
        let result = await carsRepo.deleteCars(id);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.selectCars = async (data) => {
    try{
        /* let id = await bookingService.customerId(data); */
        /* console.log(id) */
        let result = await carsRepo.selectCars(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}