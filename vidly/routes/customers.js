const express = require('express')
const router = express.Router()
const { Customer, validate } = require('../models/customer')

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name')
    res.send(customers)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = new Customer({ 
        isGold: req.body.isGold, 
        name: req.body.name, 
        phone: req.body.phone 
    })

    await customer.save()
    res.send(customer)
})

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findByIdAndUpdate(req.params.id, { 
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
     }, {new: true})

    if (!customer) return res.status(404).send("The Customer With The Given ID Was Not Found :(")

    res.send(customer)
})

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id)

    if (!customer) return res.status(404).send("The Customer With The Given ID Was Not Found :(")

    res.send(customer)
})

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)

    if (!customer) return res.status(404).send("The Customer With The Given ID Was Not Found :(")

    res.status(200).send(customer)
})


module.exports = router