const { Client } = require('pg')
require('dotenv').config()

const user = process.env.USER;
const host = process.env.HOST;
const database = process.env.DATABASE;
const password = process.env.PASSWORD;

const conf = function () {
    const client = new Client({
        user: user,
        host: host,
        database: database,
        password: password,
        pool: {
            max: 100,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
    return client
}

exports.data = conf();