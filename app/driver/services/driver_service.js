const path = require ('path');
const driverRepo = require(path.resolve('app/driver/repositories/driver_repositories'))

// logic
exports.getDriver = async (page, limit) => {
    try{
        var page = page == 0 ? 0 : page - 1;
        let skip = page * limit;
        let data = await driverRepo.getDriver(skip, limit);
        return data;
    }catch(err){
        throw new Error(err);
    }
}

exports.getDriverById = async (id) => {
    try{
        let result = await driverRepo.getDriverById(id);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.createDriver = async (data) => {
    try{
        let result = await driverRepo.createDriver(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.updateDriver = async (data) => {
    try{
        let result = await driverRepo.updateDriver(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.deleteDriver = async (id) => {
    try{
        let result = await driverRepo.deleteDriver(id);
        return result;
    }catch(err){
        throw new Error(err);
    }
}