require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./src/models/person')


// setup morgan
morgan.token('reqbody', req => JSON.stringify(req.body) ) // morgan token
const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :reqbody')

// middlewares
app.use(cors()) // enable cors
app.use(express.static('build')) // serve static contents from build folder
app.use( express.json() ) // transform every json request to json
app.use( requestLogger ) // print all requests

// port binding
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


// endpoints

app.get('/api/persons', (request, response) => {
  Person.find({}).then( result => response.json(result) )
})

app.get('/info', (request, response) => {
  Person.count({}, function( err, count){
    response.json(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then( person => {
    if (person) response.json(person)
    else response.status(404).json({ error: `Person with id ${id} not found.` })
  }).catch( error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove( request.params.id ).then( () => {
    response.status(204).end()
  }).catch( error => next(error) )
})

app.post('/api/persons', (request, response, next) => {
  const newEntry = request.body
  if (newEntry === undefined) response.status(400).json( { error:'Content missing' } )
  if (!newEntry.name) return response.status(400).json({ error:'Missing name property' })
  if (!newEntry.number) return response.status(400).json({ error:'Missing number property' })

  const person = new Person( {
    name: newEntry.name,
    number: newEntry.number
  } )
  person.save()
    .then( savedPerson => response.json(savedPerson) )
    .catch( error => next(error) )
})


app.put('/api/persons/:id', (request, response, next) => {
  const updateRequest = {
    name: request.body.name,
    number: request.body.number
  }
  Person.findOneAndUpdate( request.params.id, updateRequest, { new: true } )
    .then( updatedPerson => response.json(updatedPerson) )
    .catch( error => next(error) )
})


// more event handlers

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') return response.status(400).send({ error: 'malformatted id' })
  else if (error.name === 'ValidationError') return response.status(400).json({ error: error.message })
  next(error)
}
app.use( errorHandler ) // handle errors