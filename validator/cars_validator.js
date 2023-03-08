const joi = require('joi');

const createSchema = joi.object({
    id: joi.number().integer().required(),
    name: joi.string().min(5).max(50).required(),
    rent_price_daily: joi.number().required(),
    stock: joi.number().integer().required(),
});

const updateSchema = joi.object({
    name: joi.string().min(5).max(50).optional(),
    rent_daily_price: joi.number().integer().optional(),
    stock: joi.number().integer().optional(),
    id: joi.number().integer().required()
});

const selectSchema = joi.object({
    id: joi.number().required(),
})

module.exports = {
    createSchema,
    updateSchema,
    selectSchema,
}