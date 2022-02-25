const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator');

const mongoUrl = process.env.MONGODB_URI

// connect to database
console.log("Connecting to MongoDB...")
mongoose.connect(mongoUrl)
    .then( result => console.log("Connected to MongoDB.") )
    .catch( error => console.log("Error connecting to MongoDB.", error.message) )

// create schema
const personSchema = new mongoose.Schema({
    name: {type: String, required:true, unique:true},
    number: {type: Number, required:true}
})
personSchema.plugin(uniqueValidator)


// set toJSON
personSchema.set( 'toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// create model and export
module.exports = mongoose.model("Person", personSchema)