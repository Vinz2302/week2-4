const path = require ('path');
const customerRepo = require(path.resolve('app/customer/repositories/customer_repositories'))

// logic
exports.getCustomer = async (page, limit) => {
    try{
        var page = page == 0 ? 0 : page - 1;
        let skip = page * limit;
        let data = await customerRepo.getCustomer(skip, limit);
        return data;
    }catch(err){
        throw new Error(err);
    }
}

exports.getCustomerById = async (id) => {
    try{
        let result = await customerRepo.getCustomerById(id);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.createCustomer = async (data) => {
    try{
        let result = await customerRepo.createCustomer(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.updateCustomer = async (data) => {
    try{
        let result = await customerRepo.updateCustomer(data);
        return result;
    }catch(err){
        throw new Error(err);
    }
}

exports.deleteCustomer = async (id) => {
    try{
        let result = await customerRepo.deleteCustomer(id);
        return result;
    }catch(err){
        throw new Error(err);
    }
}