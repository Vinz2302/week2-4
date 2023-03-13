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

    //const { id, customer_id, cars_id, start_time, end_time, booktype_id, driver_id } = data;
    //console.log(data.allDates);

    try{
        await client.query('BEGIN;');

        await client.query('INSERT INTO Booking (id, customer_id, cars_id, start_time, end_time, booktype_id, driver_id, total_cost, total_driver_cost, discount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);', [id, customer_id, cars_id, start_time, end_time, booktype_id, driver_id, total_cost, total_driver_cost, discount]);
        //await client.query('update cars set stock = stock - 1 where id = $1;', [cars_id])

        //await client.query('insert into driver_incentive (')

        await client.query('COMMIT;');
        console.log('Transaction Success')
    }catch(err) {
        await client.query('ROLLBACK;')
        console.log('Transaction Failed')
        //throw err
    }
    
}

module.exports.updateBooking = async (data) => {
    
    const { customer_id, cars_id, start_time, end_time, booktype_id, driver_id, id } = data;

    /* const sql = 'UPDATE Booking SET customer_id = $1, cars_id = $2, start_time = $3, end_time = $4, booktype_id = $5, driver_id = $6, total_cost = $7, total_driver_cost = $8, discount = $9 WHERE id = $10';
    let result = await client.query(sql, [customer_id, cars_id, start_time, end_time, booktype_id, driver_id, total_cost, total_driver_cost, discount, id]);
    return result; */

    try{
        await client.query('BEGIN;');

        await client.query('UPDATE Booking SET customer_id = $1, cars_id = $2, start_time = $3, end_time = $4, booktype_id = $5, driver_id = $6, total_cost = $7, total_driver_cost = $8, discount = $9 WHERE id = $10', [customer_id, cars_id, start_time, end_time, booktype_id, driver_id, total_cost, total_driver_cost, discount, id]);

        await client.query('COMMIT;');
        console.log('Transaction Success')
    }catch(err) {
        await client.query('ROLLBACK;')
        console.log('Transaction Failed')
        //throw err
    }
    
}

module.exports.deleteBooking = async (id) => {
    const sql = 'DELETE FROM booking WHERE id = $1'
    let result = await client.query(sql, [id]);
    return result;
}