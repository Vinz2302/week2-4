const path = require ('path');
const config = require (path.resolve('config/connection.js'));
const client = config.data;

module.exports.getCars = async (skip, limit) => {

    const sql = 'SELECT * FROM cars ORDER BY id ASC OFFSET $1 LIMIT $2';
    let data = await client.query(sql,[skip, limit]);
    return data.rows;
}

module.exports.getCarsById = async (id) => {
    const sql = 'SELECT * FROM cars WHERE id = $1';
    let result = await client.query(sql, [id]);
    return result.rows[0];
}

module.exports.createCars = async (data) => {
    const { id, name, rent_price_daily, stock } = data;
    const sql = 'INSERT INTO cars VALUES ($1, $2, $3, $4)';
    let result = await client.query(sql, [id, name, rent_price_daily, stock]);
    return result;
}

module.exports.updateCars = async (data) => {
    const { name, rent_daily_price, stock, id } = data;
    const sql = 'UPDATE cars SET name = $1, rent_daily_price = $2, stock = $3 WHERE id = $4';
    let result = await client.query(sql, [name, rent_daily_price, stock, id]);
    console.log(result)
    return result;
}

module.exports.deleteCars = async (id) => {
    const sql = 'DELETE FROM cars WHERE id = $1';
    let result = await client.query(sql, [id]);
    return result;
}

/* module.exports.selectCars = async (data) => {
    const { id } = data;
    const sql = 'SELECT * FROM cars WHERE id = $1';
    let result = await client.query(sql, [id]);
    return result.rows;
} */