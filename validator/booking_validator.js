const joi = require('joi');

const createSchema = joi.object({
    id: joi.number().required(),
    customer_id: joi.number().integer().required(),
    cars_id: joi.number().integer().required(),
    start_time: joi.date().required(),
    end_time: joi.date().required(),
    total_cost: joi.number().integer().required(),
    finished: joi.boolean().required(),
});

const updateSchema = joi.object({
    customer_id: joi.number().integer().optional(),
    cars_id: joi.number().integer().optional(),
    start_time: joi.date().optional(),
    end_time: joi.date().optional(),
    total_cost: joi.number().integer().optional(),
    finished: joi.boolean().optional(),
    id: joi.number().required(),
});

module.exports = {
    createSchema,
    updateSchema,
}