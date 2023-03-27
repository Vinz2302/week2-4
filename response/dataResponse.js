class ResponseData {
    constructor(status = false, code = 400){
        this.status = status;
        this.code = code;
    }
}

module.exports = ResponseData;