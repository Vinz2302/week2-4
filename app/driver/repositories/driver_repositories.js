const path = require ('path');
const config = require (path.resolve('config/connection.js'));
const client = config.data;

module.exports.getDriver = async (skip, limit) => {

    const sql = 'SELECT * FROM driver ORDER BY id ASC OFFSET $1 LIMIT $2';
    let data = await client.query(sql,[skip, limit]);
    return data.rows;
}

module.exports.getDriverById = async (id) => {
    const sql = 'SELECT * FROM driver WHERE id = $1';
    let result = await client.query(sql, [id]);
    return result.rows[0] ;
}

module.exports.createDriver = async (data) => {
    const { id, name, nik, phone_number, daily_cost } = data;
    const sql = 'INSERT INTO driver VALUES ($1, $2, $3, $4, $5)';
    let result = await client.query(sql, [id, name, nik, phone_number, daily_cost]);
    return result;
}

module.exports.updateDriver = async (data) => {
    const { name, nik, phone_number, daily_cost, id } = data;
    console.log(data)
    const sql = 'UPDATE driver SET name = $1, nik = $2, phone_number = $3, daily_cost = $4 WHERE id = $5';
    let result = await client.query(sql, [name, nik, phone_number, daily_cost, id]);
    return result;
}

module.exports.deleteDriver = async (id) => {
    const sql = 'DELETE FROM driver WHERE id = $1'
    let result = await client.query(sql, [id]);
    return result;
}