const path = require ('path');
const config = require (path.resolve('config/connection.js'));
const client = config.data;

module.exports.getCustomer = async (skip, limit) => {

    const sql = 'SELECT * FROM customer ORDER BY id ASC OFFSET $1 LIMIT $2';
    let data = await client.query(sql,[skip, limit]);
    return data.rows;
}

module.exports.getCustomerById = async (id) => {
    const sql = 'SELECT * FROM customer WHERE id = $1';
    let result = await client.query(sql, [id]);
    return result.rows ;
}

module.exports.createCustomer = async (data) => {
    const { id, name, nik, phone_number } = data;
    const sql = 'INSERT INTO customer VALUES ($1, $2, $3, $4)';
    let result = await client.query(sql, [id, name, nik, phone_number]);
    return result;
}

module.exports.updateCustomer = async (data) => {
    const { name, nik, phone_number, id } = data;
    const sql = 'UPDATE CUSTOMER SET name = $1, nik = $2, phone_number = $3 WHERE id = $4';
    let result = await client.query(sql, [name, nik, phone_number, id]);
    return result;
}

module.exports.deleteCustomer = async (id) => {
    const sql = 'DELETE FROM customer WHERE id = $1'
    let result = await client.query(sql, [id]);
    return result;
}