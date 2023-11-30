const express = require('express')
const router = express.Router();

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
]

router.get('/', (req, res) => {
    res.send(courses)
})

router.post('/', (req, res) => {
    // Validate
    const { error } = validateCourse(req.body)

    // If invalid, return 400 - Bad request
    if (error) {
        res.status(400).send(error.details[0].message)
        return
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    courses.push(course);
    res.send(course);
})

router.put('/:id', (req, res) => {
    // Look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id))

    // If not existing, return 404
    if (!course) return res.status(404).send('The course with the given ID was not found')

    // Validate
    const { error } = validateCourse(req.body)

    // If invalid, return 400 - Bad request
    if (error) return res.status(400).send(error.details[0].message)

    // Update course
    course.name = req.body.name

    // Return the updated course
    res.send(course)
})

router.delete('/:id', (req, res) => {
    // Look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id))
    
    // If not existing, return 404
    if (!course) return res.status(404).send('The course with the given ID was not found')

    // Delete
    const index = courses.indexOf(course)
    courses.splice(index, 1)

    // Return the same course
    res.send(course)
})

router.get('/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with the given ID was not found')
    res.send(course)
})

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    return schema.validate(course)
}

module.exports = router