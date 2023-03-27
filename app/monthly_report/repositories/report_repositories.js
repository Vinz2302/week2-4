const path = require ('path');
const config = require (path.resolve('config/connection.js'));
const client = config.data;

module.exports.totalDriverCost = async (data) => {
    const { year, month } = data;
    const sql = `select sum (total_driver_cost) as "total_driver_cost" from booking
                where extract (year from end_time) = $1
                and extract (month from end_time) = $2
                and finished = true;`
    let result =  await client.query(sql, [year, month]);
    return result.rows;
}

module.exports.totalDriverIncentive = async (data) => {
    const {year, month} = data;
    const sql = `select driver_incentive.booking_id as "booking_id",
                sum(driver_incentive.incentive) as "total_driver_incentive" from booking
                join driver_incentive on booking_id = booking.id where extract
                (year from booking.end_time) = $1 and extract (month from booking.end_time)
                = $2 and booking.finished = true group by booking.id, driver_incentive.booking_id;`
    
    let result = await client.query(sql, [year, month]);
    return result.rows;
}

module.exports.getTotalCostDiscount = async (data) => {
    const { year, month } = data;
    const sql = `select sum (discount) as "discount", sum (total_cost)
                as "total_cost" from booking where extract
                (year from end_time) = $1 and extract 
                (month from end_time) = $2 and finished = true;`
    let result = await client.query(sql, [year, month]);
    return result.rows;
}

module.exports.getBookingActivity = async (data) => {
    const { year, month } = data;
    const sql = `select cars.id as "car_id", cars.name as "car_name",
                sum(date_part('day', age(booking.end_time, booking.start_time)))
                as "total_day", count(booking.cars_id) as "cars_count" from booking
                join cars on cars.id = booking.cars_id where extract 
                (year from booking.end_time) = $1 and extract 
                (month from booking.end_time) = $2 and booking.finished = true
                group by booking.cars_id, cars.id;`

    let result = await client.query(sql, [year, month]);
    return result.rows;
}

module.exports.getDriverActivity = async (data) => {
    const { year, month } = data;

    /* const sql = `select driver.id as "driver_id", driver.name as "driver_name",
                sum(date_part('day', age(booking.end_time, booking.start_time)))
                as "total_day", count(booking.driver_id) as "driver_count"
                from booking join driver on driver.id = booking.driver_id 
                where extract (year from booking.end_time) = $1 and extract (month from booking.end_time) = $2
                and booking.finished = true group by booking.driver_id , driver.id;` */

    const sql = `select driver.id as "driver_id", driver.name as "driver_name", sum(date_part('day', age(booking.end_time, booking.start_time)) + 1) as "total_day", 
                count(booking.driver_id) as "driver_count", sum (driver_incentive.incentive) as "total_driver_incentive" from booking 
                join driver on booking.driver_id = driver.id
                join driver_incentive on driver_incentive.booking_id = booking.id
                where extract (year from booking.end_time) = $1 and extract (month from booking.end_time) = $2 
                and booking.finished = true group by booking.driver_id, driver.id;`

    let result = await client.query(sql, [year, month])
    return result.rows;
}
