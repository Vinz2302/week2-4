const joi = require('joi');

/* const validator = (schema) => (payload) =>
    schema.validate(payload, {abortEarly: false}); */

const createSchema = joi.object({
    id: joi.number().required(),
    name: joi.string().min(5).max(50).required(),
    nik: joi.number().required(),
    phone_number: joi.number().required(),
    membership_id: joi.number().integer().optional(),
});

const updateSchema = joi.object({
    name: joi.string().min(5).max(50).optional(),
    nik: joi.number().integer().optional(),
    phone_number: joi.number().integer().optional(),
    membership_id: joi.number().integer().optional().allow(null).allow(''),
    id: joi.number().integer().required(),
});

module.exports = {
    createSchema,
    updateSchema,
}