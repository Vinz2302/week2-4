const path = require('path');
module.exports = app => {
    
    require(path.resolve('app/customer/routes/routes'))(app)
    require(path.resolve('app/cars/routes/routes'))(app)
    require(path.resolve('app/booking/routes/routes'))(app)
    require(path.resolve('app/driver/routes/routes'))(app)
    require(path.resolve('app/membership/routes/routes'))(app)

    };