const { Client } = require('pg')
const conf = function () {
    const client = new Client({
        user: "postgres",
        host: "35.187.248.198",
        database: "trial_week2_4_vincent",
        password: "d3v3l0p8015",
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