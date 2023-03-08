const path = require ('path');
const config = require (path.resolve('config/connection.js'));
const client = config.data;

module.exports.getMembership = async (id) => {
    const sql = 'select * from membership where id = $1';
    let result = await client.query(sql, [id]);
    return result.rows[0];
}