const path = require('path');
const moment = require('moment');

const momentRange = require('moment-range');
const extendedMoment = momentRange.extendMoment(moment);

const bookingService = require(path.resolve('app/booking/services/booking_service'))
const Response = require(path.resolve('response/response'))
const bookingRepo = require(path.resolve('app/booking/repositories/booking_repositories'))
const carsRepo = require(path.resolve('app/cars/repositories/cars_repositories'))
const customerRepo = require(path.resolve('app/customer/repositories/customer_repositories'))
const driverRepo = require(path.resolve('app/driver/repositories/driver_repositories'))
const memberRepo = require(path.resolve('app/membership/repositories/member_repositories'))
const incentiveRepo = require(path.resolve('app/driver_incentive/repositories/incentive_repositories'))
const { createSchema, updateSchema, finishSchema, idSchema } = require(path.resolve('validator/booking_validator'))

exports.getBooking = async (req, res) => {

    let page = req.query.page ? req.query.page : 0;
    let limit = req.query.limit ? req.query.limit : 10;

    try {
  
        let data = await bookingService.getBooking(page, limit)
        .then(response =>{
            if(response == 0){
                return res.status(404).json(Response.notFound("Data not Found"));
            }
            result = Response.list(response)
            return res.status(200).json(result);

        });

        return data;

    }catch(err){

        return res.status(500).json(Response.serverError(err));
    }
}

exports.getBookingById = async (req, res) => {

    try{
        let id = req.params.id;
        let result = await bookingService.getBookingById(id)
        return res.status(200).json(Response.list(result));
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

exports.getBookingByDriver = async (req, res) => {

    try{
        let id = req.params.id;
        let result = await bookingService.getBookingByDriver(id)
        return res.status(200).json(Response.list(result));
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}


exports.createBooking = async (req, res) => {

    let { error, data } = createSchema.validate (req.body, {
        abortEarly:false,
    })
    if (error){
        return res.status(400).json(Response.badRequest(error.message))
    }
    
    try{
        let data = await createSchema.validateAsync (req.body, {
            abortEarly: false,
        })
        
        let customer = await customerRepo.getCustomerById(data.customer_id)
        .then(response => {
            if (response == undefined) {
                const error = new Error()
                error.status = 404
                error.message = "Customer ID not Found"
                throw error
                //return res.status(404).json(Response.notFound('Customer id not found'))
            }

            data.membership = response.membership_id;
        })

        //let membership = await memberRepo.getMembership(data.membership)

        if (data.membership != null) {
            let membership = await memberRepo.getMembership(data.membership)
            .then(response => {
                if (response == null) {
                    const error = new Error()
                    error.status = 404
                    error.message = "Membership not Found"
                    throw error
            }
            data.membershipValue = response.daily_discount;
        })
        }
        
        let car = await carsRepo.getCarsById(data.cars_id)
        .then(response => {
            if (response == undefined) {
                const error = new Error()
                error.status = 404
                error.message = "Car ID not Found"
                throw error
            }
            if (response.stock == 0){
                const error = new Error()
                error.status = 400
                error.message = "Car out of stock"
                throw error
            }
            data.stock = response.stock
            data.rent_daily_price = response.rent_daily_price
        })
        

        let booking_data = await bookingRepo.getBookingByDriver(data.driver_id)
        .then(response => {

            if(response.length != 0){

            const startDate = moment(data.start_time).format('YYYY-MM-DD')
            const endDate = moment(data.end_time).format('YYYY-MM-DD')
            let currentTime = moment().format('YYYY-MM-DD')

            //console.log(startDate, currentTime);
            if (startDate != currentTime){
                const error = new Error()
                error.status = 400
                error.message = "Start time required today's date"
                throw error
            }

            if (startDate > endDate){
                const error = new Error()
                error.status = 400
                error.message = "invalid Date"
                throw error
            }

            const range = extendedMoment.range(startDate, endDate);

            if (data.booktype_id == 2){
                for (const date of range.by('day')) {
                    //console.log('dateRequest', date.format('YYYY-MM-DD'));
                    let requestDate = moment(date).format('YYYY-MM-DD')
                    response.forEach( dates => {
                    startDateBooking = moment(dates.start_time).format('YYYY-MM-DD')
                    endDateBooking = moment(dates.end_time).format('YYYY-MM-DD')
        
                            const rangeBooking = extendedMoment.range(startDateBooking, endDateBooking);
                            for (let dateBooking of rangeBooking.by('day')){
                                dateBooking = moment(dateBooking).format('YYYY-MM-DD')
                                //console.log('date from booking', dateBooking);
                                if (requestDate === dateBooking) {
                                    const error = new Error()
                                    error.status = 400
                                    error.message = "Driver not available on that day"
                                    throw error
                                    }
                                }
                            })
                        }
                    }
                }
            });

        if (data.booktype_id == 2){
            if (data.driver_id == null || data.driver_id == 0){
                const error = new Error()
                error.status = 404
                error.message = "Driver ID not Found"
                throw error
            }
        }
        if (data.booktype_id == 1){
            data.driver_id = undefined;
            console.log("Book without driver");
        }

        let driver = await driverRepo.getDriverById(data.driver_id)
        .then(response => {
            if (response != null){
                data.driverCost = response.daily_cost
            }
            //data.driverCost = response.daily_cost
        });

        //let booktype = await bookingRepo.getBookingById
        
        let result = await bookingService.createBooking(data)
        .then(() => res.status(200).json(Response.created('booking')));
        return result;
    }catch(err){
        if (err.status === 404){
            return res.status(404).json(Response.notFound(err.message));
        }
        if (err.status === 400){
            return res.status(400).json(Response.badRequest(err.message));
        }
        return res.status(500).json(Response.serverError(err));
    }
}

exports.updateBooking = async (req, res) => {

    let idString = req.params.id;
    try{
        let id = parseInt(idString)
        if (isNaN(id)){
            throw new Error ("param must be number")
        }
    }catch(error1){
        return res.status(400).json(Response.badRequest(error1.message))
    }

    
    let {error, data} = updateSchema.validate (req.body, {
        abortEarly:false,
    })
    if (error) {
        return res.status(400).json(Response.badRequest(error.message))
    }
    

    try{
        let data = await updateSchema.validateAsync(req.body,{
            abortEarly:false,
        })

        let id = parseInt(idString)

        data.id = id;

        let booking = await bookingRepo.getBookingById(data.id)
        .then(response => {

            if (response == null || response == undefined){
                const error = new Error()
                error.status = 404
                error.message = "Booking ID not Found"
                throw error
            }
            
             if (response.finished === true){
                const error = new Error()
                error.status = 403
                error.message = "Booking had already finished"
                throw error
             }
             data.previousCar = response.cars_id;
        })

        let incentive = await incentiveRepo.getIncentiveById(data.id)
        .then(response => {
            data.incentive = response;
            //console.log(data.incentive);
        })

        let customer = await customerRepo.getCustomerById(data.customer_id)
        .then(response => {
            if (response == 0 || response == undefined) {
                const error = new Error()
                error.status = 404
                error.message = "Customer ID not Found"
                throw error
            }

            data.membership = response.membership_id;
        })

        //let membership = await memberRepo.getMembership(data.membership)
        //data.membershipValue = membership.daily_discount;
        if (data.membership != null) {
        let membership = await memberRepo.getMembership(data.membership)
        .then(response => {
            data.membershipValue = response.daily_discount;
        })
        }
        
        //check current stock
        let car = await carsRepo.getCarsById(data.cars_id)
        .then(response => {
            //check previous car id and current car id
            if (data.previousCar != data.cars_id && response.stock == 0) {
                const error = new Error();
                error.status = 400;
                error.message = "Cars out of stock";
                throw error;
            }
            
            if (response == 0) {
                const error = new Error()
                error.status = 404
                error.message = "Car ID not Found"
                throw error
            }
            
            data.stock = response.stock
            data.rent_daily_price = response.rent_daily_price
        })

        if (data.booktype_id > 2){
            const error = new Error()
            error.status = 404
            error.message = "Booktype ID must be 1 or 2"
            throw error
        }

        //take previous startDate and endDate by id from booking
        let booking_ById = await bookingRepo.getBookingById(data.id)
        .then(response => {
            data.previousStartDate = moment(response.start_time).format('YYYY-MM-DD')
            data.previousEndDate = moment(response.end_time).format('YYYY-MM-DD') 
        })

        let booking_data = await bookingRepo.getBookingByDriver(data.driver_id)
        .then(response => {
            if(response.length != 0){
                const startDate = moment(data.start_time).format('YYYY-MM-DD')
                const endDate = moment(data.end_time).format('YYYY-MM-DD')
                let currentDate = moment().format('YYYY-MM-DD')

                //ambil data start dan end dari booking sesuai id
                let check = response.find(obj => obj.id === data.id);

                if (check != undefined || check == ""){
                    previousStartDate = moment(check.start_time).format('YYYY-MM-DD')
                    previousEndDate = moment(check.end_time).format('YYYY-MM-DD')
                } else {
                    previousStartDate = data.previousStartDate
                    previousEndDate = data.previousEndDate
                }

                if (startDate != currentDate){
                    const error = new Error()
                    error.status = 400
                    error.message = "Start date required today's date"
                    throw error
                }

                if (startDate > endDate){
                    const error = new Error()
                    error.status = 404
                    error.message = "Invalid Date"
                    throw error
                }
                
                if (data.booktype_id === 2){

                    const range = extendedMoment.range(startDate, endDate);
                    const previousRange = extendedMoment.range(previousStartDate, previousEndDate);

                    console.log('range', range);
                    console.log('previous range', previousRange);

                    //if (previousRange.overlaps(range)){
                        //console.log("range overlap");
                        //console.log(range);
                        for(const date of range.by('day')){
                            let requestDate = moment(date).format('YYYY-MM-DD')
                            response.forEach( dates => {
    
                                console.log(requestDate);
                                //console.log(dates.id);
                                //console.log(dates.id)

                                if (dates.id === data.id) {
                                    return;
                                }
                                //console.log(dates);
                                //console.log(dates.id);
                                //console.log(dates);
                                //const datesWithoutLast = dates.slice(0, -1);
                                //console.log(datesWithoutLast);
                                startDateBooking = moment(dates.start_time).format('YYYY-MM-DD')
                                endDateBooking = moment(dates.end_time).format('YYYY-MM-DD')
        
                                const rangeBooking = extendedMoment.range(startDateBooking, endDateBooking);
                                for (let dateBooking of rangeBooking.by('day')){
                                    dateBooking = moment(dateBooking).format('YYYY-MM-DD')
                                    console.log(dateBooking);
                                    if(requestDate === dateBooking){
                                        const error = new Error()
                                        error.status = 400
                                        error.message = "Driver not available on that day"
                                        throw error
                                    }
                                }
                            }
                            )
                        }
                    
                }
            }
        })
        
        let driver = await driverRepo.getDriverById(data.driver_id)
        .then(response => {
            if (response != undefined || response != null){
                data.driverCost = response.daily_cost
            }
            if (data.booktype_id === 1){
                data.driver_id = undefined;
            }
            if (response == undefined && data.booktype_id == 2){
                const error = new Error()
                error.status = 404
                error.message = "Driver not Found"
                throw error
            }
        })

        let result = await bookingService.updateBooking(data)
        .then(() => res.status(200).json(Response.updated('booking')));
        return result;
    }catch(err){
        console.log(err);
        if (err.status === 404){
            return res.status(404).json(Response.notFound(err.message));
        }
        if (err.status === 400){
            return res.status(400).json(Response.badRequest(err.message));
        }
        if (err.status === 403){
            return res.status(403).json(Response.forbidden(err.message));
        }
        return res.status(500).json(Response.serverError(err));
    }
}

exports.deleteBooking = async (req, res) => {

    let data = req.params.id;
    try{
        let id = parseInt(data)
        if(isNaN(id)){
            throw new Error ("param must be number")
        }
    }catch(err){
        return res.status(400).json(Response.badRequest(err.message))
    }

    try{
        data = {
            id: parseInt(req.params.id)
        }

        console.log(data);

        let booking = await bookingRepo.getBookingById(data.id)
        .then(response => {
            console.log(response);
            if(response == null || response == undefined){
                const error = new Error()
                error.status = 404
                error.message = "Booking ID not Found"
                throw error
            }

            if(response.finished == true){
                const error = new Error()
                error.status = 403
                error.message = "Booking had already finished"
                throw error
            }
            data.booktype_id = response.booktype_id;
            data.cars_id = response.cars_id;
        })
        console.log(data);

        let result = await bookingService.deleteBooking(data)
        .then(() => res.status (200).json(Response.deleted('booking')));
        return result;
    }catch(err){
        if (err.status === 404){
            return res.status(404).json(Response.notFound(err.message));
        }
        if (err.status === 403){
            return res.status(403).json(Response.forbidden(err.message));
        }
        if (err.status === 400){
            return res.status(400).json(Response.badRequest(err.message));
        }
        return res.status(500).json(Response.serverError(err));
    }

}

exports.finishBooking = async (req, res) => {

    let idString = req.params.id;
    try{
        let id = parseInt(idString)
        if(isNaN(id)){
            throw new Error ("param must be number")
        }
    }catch(err){
        return res.status(400).json(Response.badRequest(err.message))
    }

    let { error, data } = finishSchema.validate (req.body)
    if(error){
        return res.status(400).json(Response.badRequest(error.message))
    }

    try{

        //let booking = await bookingRepo.getCustomerById(data)
        /* let data = await finishSchema.validateAsync (req.body, {
            abortEarly: false,
        }) */
        /* let data = {
            id: req.params.id,
            finishTime: req.body
        }; */
        let data = await finishSchema.validateAsync(req.body, {
            abortEarly: false,
        })

        let idString = req.params.id;
        let id = parseInt(idString);
        
        data.id = id;

        data.finishTime = moment(data.finishTime).format('YYYY-MM-DD')
        let currentDate = moment().format('YYYY-MM-DD')

        if(data.finishTime != currentDate){
            const error = new Error()
            error.status = 400
            error.message = "Required today's date"
            throw error
        }

        let booking = await bookingRepo.getBookingById(data.id)
        .then(response => {

            if(response == undefined || response == null){
                const error = new Error()
                error.status = 404
                error.message = "Booking ID not Found"
                throw error
            }

            if (response.finished == true){
                const error = new Error()
                error.status = 403
                error.message = "Booking had already finished"
                throw error
            }

            let endTime = moment(response.end_time).format('YYYY-MM-DD')
            let startTime = moment(response.start_time).format('YYYY-MM-DD')

            console.log(data.finishTime, endTime, startTime);
            if (endTime < startTime){
                const error = new Error()
                error.status = 400
                error.message = "Invalid Date"
                throw error
            }

            if (data.finishTime <= endTime){
                data.endTime = endTime
            }
            if (data.finishTime > endTime){
                data.endTime = data.finishTime
            }

            data.startTime = startTime

            data.customer_id = response.customer_id
            data.cars_id = response.cars_id
            data.driver_id = response.driver_id
        }) 
        console.log(data);

        let customer = await customerRepo.getCustomerById(data.customer_id)
        .then(response => {
            if (response == 0){
                const error = new Error()
                error.status = 404
                error.message = "Customer ID not Found"
                throw error
            }
            data.membership = response.membership_id;
        })

        let membership = await memberRepo.getMembership(data.membership)
        .then (response => {
            data.membershipValue = response.daily_discount;
        })

        let car = await carsRepo.getCarsById(data.cars_id)
        .then(response => {
            data.rent_daily_price =response.rent_daily_price
        })

        let driver = await driverRepo.getDriverById(data.driver_id)
        .then(response => {
            data.driverCost = response.daily_cost
        })

        let result = await bookingService.finishBooking(data)
        .then(() => res.status (200).json(Response.updated('booking')));
        return result
    }catch(err){
        if (err.status === 404){
            return res.status(404).json(Response.notFound(err.message));
        }
        if (err.status === 400){
            return res.status(400).json(Response.badRequest(err.message));
        }
        if (err.status === 403){
            return res.status(403).json(Response.forbidden(err.message));
        }
        return res.status(500).json(Response.serverError(err));
    }
}

/* exports.totalDriverCost = async (req, res) => {
    try{
        let data = req.body;
        // let year = req.params.year;
        // let month = req.params.month;

        let result = await bookingService.totalDriverCost(year, month)
        return res.status(200).json(Response.list(result));
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
} */

exports.totalDriverCost = async (req, res) => {
    try{
        //let data = req.body;
        // let year = req.params.year;
        // let month = req.params.month;
        let data = {
            year: parseInt(req.params.year),
            month: parseInt(req.params.month)
        }
        console.log(data);

        let result = await bookingService.totalDriverCost(data)
        return res.status(200).json(Response.list(result));
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

exports.totalDriverIncentive = async (req, res) => {
    try{
        
        let data = {
            year: parseInt(req.params.year),
            month: parseInt(req.params.month)
        }

        //console.log(data);

        usedId = [];
        let getIdByDate = await bookingRepo.getIdByDate(data)
        .then(response => {
            //console.log(response);
            response.forEach(obj => {
                usedId.push(obj.id)
            })
            data.usedId = usedId
        })

        console.log('id',usedId);
        //console.log(data);

        data.incentive = [];

        for (let i = 0; i < usedId.length; i++){
            let incentive = await bookingRepo.selectIncentiveById(data.usedId[i])
            incentive.forEach(obj => {
                data.incentive.push(obj.incentive)
            })

        }

        let intIncentive = data.incentive.map(str => parseInt(str));
        
        let sum = intIncentive.reduce((a, b) => a + b, 0);

        data.total_incentive = sum;

        console.log(data);
        
        /* let incentive = await bookingRepo.selectIncentiveById(data)
        .then(response => {
            console.log(response);
        }) */

        //let result = await bookingService.totalDriverIncentive(data)

        return res.status(200).json(Response.getDriverIncentive(data.total_incentive));

    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

exports.totalDriverExpense = async (req, res) => {
    try{

        let data = {
            year: parseInt(req.params.year),
            month: parseInt(req.params.month)
        }

        let totalDriverCost = await bookingRepo.totalDriverCost(data)
        .then(response => {

            data.totalDriverCost = parseInt(response[0]['Total Driver Cost']);        
        })

        usedId = [];
        let getIdByDate = await bookingRepo.getIdByDate(data)
        .then(response => {
            response.forEach(obj => {
                usedId.push(obj.id)
            })
            data.usedId = usedId
        })

        data.incentive = [];
        for (let i = 0; i < usedId.length; i++){
            let incentive = await bookingRepo.selectIncentiveById(data.usedId[i])
            incentive.forEach(obj => {
                data.incentive.push(obj.incentive)
            })
        }

        let intIncentive = data.incentive.map(str => parseInt(str));

        let sum = intIncentive.reduce((a,b) => a + b, 0);

        data.total_incentive = sum;

        data.totalExpense = data.totalDriverCost + data.total_incentive

        console.log(data);

        return res.status(200).json(Response.getDriverExpense(data.totalExpense));
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}

exports.totalGrossIncome = async (req, res) => {
    try{

        let data = {
            year: parseInt(req.params.year),
            month: parseInt(req.params.month)
        }

        let discount = await bookingRepo.getDiscountByDate(data)
        .then(response => {
            console.log(response);
            data.discount = parseInt(response[0]['Discount']);
        })

        let totalDriverCost = await bookingRepo.totalDriverCost(data)
        .then(response => {

            data.totalDriverCost = parseInt(response[0]['Total Driver Cost']);        
        })

        let totalCost = await bookingRepo.getTotalCostByDate(data)
        .then(response => {
            console.log(response);
            data.totalCost = parseInt(response[0]['Total Cost']);
        })

         console.log(data);


        let result = await bookingService.totalGrossIncome(data)
        return res.status(200).json(Response.list(result));
    }catch(err){
        return res.status(500).json(Response.serverError(err));
    }
}