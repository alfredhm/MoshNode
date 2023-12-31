const { Rental, validate } = require('../models/rental')
const { Movie } = require('../models/movie')
const { Customer } = require('../models/customer')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut')
    res.send(rentals)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findById(req.body.customerId)
    if (!customer) return res.status(400).send('Invalid customer.')

    const movie = await Movie.findById(req.body.movieId)
    if (!movie) return res.status(400).send('Invalid Movie')

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.')

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }, 
    })

    
        const session = await mongoose.startSession();
        session.startTransaction()
        try {
            rental = await rental.save()
            const movie = await Movie.findByIdAndUpdate(rental.movie._id, {
                $inc: { numberInStock: -1 }
            })
            movie.save()
            await session.commitTransaction()
            console.log(rental)
            res.send(rental) 
        } catch (ex) {
            await session.abortTransaction()
            console.log(ex)
            res.status(500).send('Something failed.')
        } finally {
            session.endSession()  
        }
})

module.exports = router

