require("dotenv").config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')



const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const Person = require('./src/models/person')

morgan.token('reqbody', req => JSON.stringify(req.body) ) // morgan token
const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :reqbody')

app.use(cors()) 
app.use(express.static('build')) 
app.use(express.json()) 
app.use(requestLogger)


app.get("/api/persons", (req, res)=>{
    Person.find({}).then( result => res.json(result) )
}) 

app.get("/info", (req, res)=>{
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
    )
}) 

app.get("/api/persons/:id", (req, res, next)=>{
    Person.findById(req.params.id).then( person => {
        if (person) res.json(person)
        else res.status(404).send(`Person with id ${id} not found.`)
    }).catch( error => next(error))
})

app.delete("/api/persons/:id", (req, res, next)=> {
    Person.findByIdAndRemove( req.params.id ).then( result => {
        res.status(204).end()
    }).catch( error => next(error) )
})

app.post("/api/persons", (req, res)=>{
    const newPerson = req.body
    if (newPerson === undefined) res.status(400).json( {error:"Content missing"} )
    if (!newPerson.name) return res.status(400).json({error:"Missing name property"})
    if (!newPerson.number) return res.status(400).json({error:"Missing number property"})
    

    const person = new Person( {
        name: newPerson.name,
        number: newPerson.number
    } )
    person.save().then( savedPerson => res.json(savedPerson) )
})


const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') return res.status(400).send({ error: 'malformatted id' })
    next(error)
}
app.use( errorHandler )

//to deploy heroku use command  $ git subtree push --prefix phonebook_backend heroku main