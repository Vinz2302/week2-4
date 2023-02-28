const path = require ('path');
const carsRepo = require(path.resolve('app/cars/repositories/cars_repositories'))

exports.getCars = async (data) => {
    try{
        let data = await carsRepo.getCars(data);
        return data;
    }catch(err){
        throw new Error(err);
    }
}

export.createCars = async (data) => {
    try{
        let result = await carsRepo.createCars(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

export.updateCars = async (data) => {
    try{
        let result = await carsRepo.updateCars(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

export.deleteCars = async (data) => {
    try{
        let result = await carsRepo.deleteCars(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}