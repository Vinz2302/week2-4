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
    return result.rows ;
}

module.exports.createBooking = async (data) => {
    const { id, customer_id, cars_id, start_time, end_time, total_cost, finished } = data;
    const sql = 'INSERT INTO Booking VALUES ($1, $2, $3, $4, $5, $6, $7)';
    let result = await client.query(sql, [id, customer_id, cars_id, start_time, end_time, total_cost, finished]);
    return result;
}

module.exports.updateBooking = async (data) => {
    const { customer_id, cars_id, start_time, end_time, total_cost, finished, id } = data;
    const sql = 'UPDATE Booking SET customer_id = $1, cars_id = $2, start_time = $3, end_time = $4, total_cost = $5, finished = $6 WHERE id = $7';
    let result = await client.query(sql, [customer_id, cars_id, start_time, end_time, total_cost, finished, id]);
    return result;
}

module.exports.deleteBooking = async (id) => {
    const sql = 'DELETE FROM booking WHERE id = $1'
    let result = await client.query(sql, [id]);
    return result;
}