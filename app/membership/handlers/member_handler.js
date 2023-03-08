const path = require('path');

const memberService = require(path.resolve('app/membership/services/member_service'));
const Response = require(path.resolve('response/response'));

exports.getMembership = async (req, res) => {
    
    try{
        let id = req.params.id;
        let result = await memberService.getMemberById(id)
        return res.status(200).json(Response.list(result));
    }catch(err) {
        return res.status(500).json(Response.serverError(err));
    }
}