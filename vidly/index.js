const Joi = require('joi')
const express = require('express')

const app = express()
app.use(express.json())

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    return schema.validate(genre)
}

const genres = [
    { id: 1, name: "Action" },
    { id: 1, name: "Comedy" },
    { id: 1, name: "Drama" },
]

app.get('/', (req, res) => {
    res.send('Vidly Home Page')
})

app.get('/api/genres', (req, res) => {
    res.send(genres)
})

app.post('/api/genres', (req, res) => {
    const { error } = validateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }

    genres.push(genre)
    res.send(genre)
})

app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if (!genre) return res.status(404).send("The Genre With The Given ID Was Not Found :(")

    const { error } = validateGenre(genre)
    if (error) return res.status(400).send(error.details[0].message)

    genre.name = req.body.name
    res.send(genre)
})

app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if (!genre) return res.status(404).send("The Genre With The Given ID Was Not Found :(")

    const index = genres.indexOf(genre)
    genres.splice(index, 1)

    res.send(genre)
})

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id))
    if (!genre) return res.status(404).send("The Genre With The Given ID Was Not Found :(")
    res.status(200).send(genre)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))

