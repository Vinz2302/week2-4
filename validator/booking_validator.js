const joi = require('joi');

const createSchema = joi.object({
    customer_id: joi.number().integer().required(),
    cars_id: joi.number().integer().required(),
    start_time: joi.date().required(),
    end_time: joi.date().required(),
    booktype_id: joi.number().integer().required(),
    driver_id: joi.number().integer().allow(null).allow('').allow("").optional(),
});

const updateSchema = joi.object({
    customer_id: joi.number().integer().optional(),
    cars_id: joi.number().integer().optional(),
    start_time: joi.date().optional(),
    end_time: joi.date().optional(),
    booktype_id: joi.number().integer().optional(),
    driver_id: joi.number().integer().allow(null).allow('').allow("").optional(),
});

const finishSchema = joi.object({
    finishTime: joi.date().required(),
});

const idSchema = joi.object({
    id: joi.string().required(),
});

module.exports = {
    createSchema,
    updateSchema,
    finishSchema,
    idSchema,
}