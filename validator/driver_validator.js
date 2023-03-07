const joi = require('joi');

const createSchema = joi.object({
    id: joi.number().required(),
    name: joi.string().min(5).max(50).required(),
    nik: joi.number().required(),
    phone_number: joi.number().required(),
    daily_cost: joi.number().integer().required(),
});

const updateSchema = joi.object({
    name: joi.string().min(5).max(50).optional(),
    nik: joi.number().integer().optional(),
    phone_number: joi.number().integer().optional(),
    daily_cost: joi.number().integer().optional(),
    id: joi.number().integer().required(),
});

module.exports = {
    createSchema,
    updateSchema,
}