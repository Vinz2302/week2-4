const path = require('path');
module.exports = app => {
    
    require(path.resolve('app/customer/routes/routes'))(app)

    };