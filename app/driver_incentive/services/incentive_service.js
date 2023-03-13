const path = require ('path');
const memberRepo = require(path.resolve('app/driver_incentive/repositories/incentive_repositories'));

exports.getIncentiveById = async (id) => {
    try{
        var result = await memberRepo.getIncentiveById(id);
        return result;
    }catch(err){
        throw new Error(err);
    }
}