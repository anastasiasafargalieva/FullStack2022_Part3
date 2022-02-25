const mongoose = require("mongoose")

if (process.argv.length < 3){
    console.log("Please provide the password as an argument: node mongo.js <password>")
    process.exit(1)
}

const password = process.argv[2]
const database = "phonebook-database"
const url = `mongodb+srv://anastasia:${password}@cluster0.4z5bl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length === 3){
    // list all phonebook
    Person.find({}).then( result => {
        console.log("phonebook:")
        result.forEach( p => {
            console.log(`${p.name} ${p.number}`)
        } )
        mongoose.connection.close()
    })

}else if (process.argv.length >= 5){
    // add a new phone
    const newPerson = new Person({
        id: Math.floor( Math.random() * 100000 ),
        name: process.argv[3],
        number: process.argv[4]
    })
    newPerson.save().then( result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    } )

}else {
    console.log("Please provide the name and number: node mongo.js <password> <name> <number>")
    process.exit(1)
} 