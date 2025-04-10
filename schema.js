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


//SS validation for reviews using Joi

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required().trim().min(1).disallow(''),
    })
}).required()