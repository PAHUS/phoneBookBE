const { response, json } = require('express')
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

morgan.token('data', (req,res) =>  req.method === 'POST' ? JSON.stringify(req.body) : null )
app.use(morgan('tiny'))
app.use(morgan(':data'))

let persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.post('/api/persons', (req, res) => {
    const person = req.body
    
    if (!person.name || !person.number) {
        return res.status(400).json({ 
            error: 'content missing' 
          })
    }
    console.log(persons.find(per => per.name === person.name))
    if (persons.find(per => per.name === person.name)) {
        return res.status(400).json({
            error: 'person with that name already exists'
        })
    }
    
    person.id = Math.floor(Math.random() * 1000) + 1 
    console.log(person)
    persons = persons.concat(person)
    res.json(person)
})

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(per => per.id !== id)
    console.log('deleted?')
    res.status(204).end()
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id, typeof(id))
    const person = persons.find(per => per.id === id)

    if (person) {
         res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req,res) => {
    console.log('info reached')
    res.send(
        `<p>This phonebook contains ${persons.length} persons.</p> 
         ${Date()}
        `)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })