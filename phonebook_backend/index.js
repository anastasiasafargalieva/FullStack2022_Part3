const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')



const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.use(cors()) 
app.use(express.static('build')) 
app.use(express.json()) 
morgan.token('reqbody', req => JSON.stringify(req.body) )
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqbody'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get("/api/persons", (req, res)=>{
    res.json(persons)
}) 

app.get("/info", (req, res)=>{
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
    )
}) 

app.get("/api/persons/:id", (req, res)=>{
    const id = Number(req.params.id)
    const person = persons.find( e => e.id === id )
    if (person) res.json( person )
    else res.status(404).send(`Person with id ${id} not found.`)
})

app.delete("/api/persons/:id", (req, res)=> {
    const id = Number(req.params.id)
    persons = persons.filter( e => e.id !== id)
    res.status(204).end()
})

app.post("/api/persons", (req, res)=>{
    const newPerson = req.body
    if (!newPerson.name) return res.status(400).json({error:"Missing name property"})
    if (!newPerson.number) return res.status(400).json({error:"Missing number property"})
    if ( persons.find(e => e.name.toLowerCase().trim() === newPerson.name.toLowerCase().trim()) )
        return res.status(400).json({error:"The name must be unique"})
    newPerson.id = Math.floor( Math.random() * 100000 )
    persons = persons.concat(newName)
    res.json(newPerson)
})

//to deploy heroku use command  $ git subtree push --prefix phonebook_backend heroku main