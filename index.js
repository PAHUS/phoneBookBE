const { response, json } = require('express')
require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('data', (req,res) =>  req.method === 'POST' ? JSON.stringify(req.body) : null )
app.use(morgan('tiny'))
app.use(morgan(':data'))


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
  }

//database
const Person = require('./models/person')




/*let persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]*/

app.get('/api/persons', (request, response, next) => {
    Person
    .find({})
    .then(people => {
      response.json(people)
    })
    .catch(error => next(error))
})


app.post('/api/persons', (req, res, next) => {
    const body = req.body
    console.log(body.name, typeof(body.name))
    console.log(body.number, typeof(body.number))
    
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    
    if (Person.find({name: body.name}).length === 0) {
        return res.status(400).json({
            error: 'person with that name already exists'
        })
        
    }
    console.log(person.name, person.number)
    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

app.delete('/api/persons/:id', (req,res, next) => {
    const id = req.params.id
    console.log('deleting', id)
    Person
        .findByIdAndDelete(id)
        .then(deleted => res.status(204).end())
        .catch(error => next(error))
    
})

app.get('/api/persons/:id', (req, res, next) => {
     Person.findById(req.params.id).then(person => {
         if (person){
            res.json(person)
         } else {
             res.status(404).end()
         }
     })
     .catch(error => next(error))
})

app.get('/info', (req,res) => {
    console.log('info reached')
    res.send(
        `<p>This phonebook contains ${Person.length} persons.</p> 
         ${Date()}
        `)
})

//Handling errors: 
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })