const path = require ('path');
const memberRepo = require(path.resolve('app/membership/repositories/member_repositories'));

exports.getMemberById = async (id) => {
    try{
        var result = await memberRepo.getMembership(id);
        return result;
    }catch(err){
        throw new Error(err);
    }
}