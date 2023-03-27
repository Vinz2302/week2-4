const path = require ('path');
const config = require (path.resolve('config/connection.js'));
const client = config.data;

module.exports.getBooking = async (skip, limit) => {

    const sql = 'SELECT * FROM Booking ORDER BY id ASC OFFSET $1 LIMIT $2';
    let data = await client.query(sql,[skip, limit]);
    return data.rows;
}

module.exports.getBookingById = async (id) => {
    const sql = 'SELECT * FROM Booking WHERE id = $1';
    let result = await client.query(sql, [id]);
    return result.rows[0];
}

module.exports.getBookingByDriver = async (id) => {
    const sql = 'select * from booking where driver_id = $1 order by id asc';
    let result = await client.query(sql, [id]);
    return result.rows;
}

module.exports.createBooking = async (data) => {

    /* const { id, customer_id, cars_id, start_time, end_time, booktype_id, driver_id } = data;
    const sql = 'INSERT INTO Booking (id, customer_id, cars_id, start_time, end_time, booktype_id, driver_id, total_cost, total_driver_cost, discount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    let result =  client.query(sql, [id, customer_id, cars_id, start_time, end_time, booktype_id, driver_id, total_cost, total_driver_cost, discount]);
    return result; */

    const { customer_id, cars_id, start_time, end_time, booktype_id, driver_id } = data;
    //console.log(data.allDates);

    try{
        await client.query('BEGIN;');

        await client.query('INSERT INTO Booking (customer_id, cars_id, start_time, end_time, booktype_id, driver_id, total_cost, total_driver_cost, discount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);', [customer_id, cars_id, start_time, end_time, booktype_id, driver_id, total_cost, total_driver_cost, discount]);
        if (data.booktype_id === 2){
            const lastBooking = await client.query('select id from booking order by id desc limit 1');
            const bookingId = lastBooking.rows[0].id
            //await client.query(`insert into driver_incentive (booking_id, incentive) values (nextval('booking_id_seq'), $1)`, [driver_incentive]);
            await client.query(`insert into driver_incentive (booking_id, incentive) values ($1, $2)`, [bookingId, driver_incentive]);
        }
        await client.query('update cars set stock = stock - 1 where id = $1;', [cars_id])

        await client.query('COMMIT;');

        console.log('Transaction Success')
    }catch(err) {
        await client.query('ROLLBACK;')
        console.log('Transaction Failed')
        throw err
    }
    
}

module.exports.updateBooking = async (data) => {
    
    const { customer_id, cars_id, start_time, end_time, booktype_id, driver_id, id } = data;
    //console.log(id);
    //console.log(data);

    try{
        await client.query('BEGIN;');

        await client.query('UPDATE Booking SET customer_id = $1, cars_id = $2, start_time = $3, end_time = $4, booktype_id = $5, driver_id = $6, total_cost = $7, total_driver_cost = $8, discount = $9 WHERE id = $10', [customer_id, cars_id, start_time, end_time, booktype_id, driver_id, total_cost, total_driver_cost, discount, id]);
        
        await client.query('update cars set stock = stock + 1 where id = $1;', [data.previousCar]);

        await client.query('update cars set stock = stock - 1 where id = $1;', [cars_id]);

        //jika tidak terdapat data di tabel incentive
        if (data.incentive == "" && data.booktype_id === 2){
            await client.query(`insert into driver_incentive (booking_id, incentive) values ($1, $2)`, [data.id, driver_incentive]);
        }

        if (data.booktype_id === 2){
            await client.query('update driver_incentive set incentive = $1 where booking_id = $2;', [driver_incentive, id])
        } if (data.booktype_id === 1){
            await client.query('delete from driver_incentive where booking_id = $1;', [id])
        }

        await client.query('COMMIT;');
        console.log('Transaction Success')
    }catch(err) {
        await client.query('ROLLBACK;')
        console.log('Transaction Failed')
        throw err
    }
}

module.exports.deleteBooking = async (data) => {

    console.log(data);
    const { id, cars_id, booktype_id } = data;
    
    try{
        await client.query('BEGIN;');

        await client.query('delete from booking where id = $1;', [id]);

        await client.query('update cars set stock = stock + 1 where id = $1;', [cars_id]);

        if (booktype_id === 2){
            await client.query('delete from driver_incentive where booking_id = $1;', [id])
        }

        await client.query('COMMIT;');

        console.log("Transaction Success");
    }catch(err){
        await client.query('ROLLBACK');
        console.log("Transaction Failed");
        throw err
    }
}

module.exports.finishBooking = async (data) => {
    const { id, endTime, cars_id } = data;
    console.log(data);

    try{
        await client.query('BEGIN;');

        await client.query('update booking set finished = true, end_time = $2, total_cost = $3, discount = $4, total_driver_cost = $5 where id = $1;', [id, endTime, total_cost, discount, total_driver_cost]);

        await client.query('update cars set stock = stock + 1 where id = $1', [cars_id]);

        await client.query('COMMIT;');

        console.log("Transaction Success");
    }catch(err) {
        await client.query('ROLLBACK;');
        console.log('Transaction Failed');
        throw err
    }
}

/* module.exports.totalDriverCost = async (data) => {
    const { year, month } = data;
    console.log(data);
    const sql = `select sum (total_driver_cost) as "Total Driver Cost" from booking
                where extract (year from end_time) = $1
                and extract (month from end_time) = $2
                and finished = true;`
    let result = await client.query(sql, [year, month]);
    console.log(result.rows);
    return result.rows;
} */

module.exports.totalDriverCost = async (data) => {
    const { year, month } = data;
    //console.log(data);
    const sql = `select sum (total_driver_cost) as "Total Driver Cost" from booking
                where extract (year from end_time) = $1
                and extract (month from end_time) = $2
                and finished = true;`
    let result = await client.query(sql, [year, month]);
    //console.log(result.rows);
    return result.rows;
}

module.exports.getTotalCostByDate = async (data) => {
    const { year, month } = data;
    const sql = `select sum (total_cost) as "Total Cost" from booking
                where extract (year from end_time) = $1
                and extract (month from end_time) = $2
                and finished = true;`
    let result = await client.query(sql, [year, month]);
    return result.rows;
}

module.exports.getIdByDate = async (data) => {
    const { year, month } = data;
    const sql = `select id from booking 
                where extract (year from end_time) = $1
                and extract (month from end_time) = $2
                and finished = true;`
    let result = await client.query(sql, [year, month]);
    return result.rows;
}

module.exports.selectIncentiveById = async (data) => {
    const { usedId } = data;

    const sql = `select incentive from driver_incentive where booking_id = $1`
    let result = await client.query(sql, [data]);



    return result.rows;
}

module.exports.getDriverIncentive = async (data) => {
    /* const sql = `select sum (incentive) as "Total Driver Incentive" from driver_incentive where id = $1`
    let result = await client.query(sql, []);
    return result.rows; */

    console.log(data);
    let result = data.total_incentive
    return res.status(200).json(result);
}

module.exports.getDiscountByDate = async (data) => {
    const { year, month } = data;
    const sql = `select sum (discount) as "Discount" from booking
                where extract (year from end_time) = $1
                and extract (month from end_time) = $2
                and finished = true;`
    let result = await client.query(sql, [year, month]);
    return result.rows;
}

module.exports.getCarsMonthlyReport = async (data) => {
    const { year, month } = data;
    const sql = `select cars.id as "car_id", cars.name as "car_name", count(booking.car_id) as "count_car" from booking
                join cars on cars.id = booking.id where extract (year from booking.end_time) = $1
                and extract (month from booking.end_time) = $2
                and booking.finished = true groupby booking.car_id;`
    
}