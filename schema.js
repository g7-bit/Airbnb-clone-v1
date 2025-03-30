// joi package schema

const Joi = require('joi');

module.exports.listingSchema= Joi.object({

    listing: Joi.object({

        title: Joi.string().required(),          // strings..
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),    //number
        image: Joi.string().allow("", null)      //allow empty str or null value
    })
})