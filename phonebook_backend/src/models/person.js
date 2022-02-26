const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const mongoUrl = process.env.MONGODB_URI


console.log('Connecting to MongoDB...')
mongoose.connect(mongoUrl)
  .then( () => console.log('Connected to MongoDB.') )
  .catch( error => console.log('Error connecting to MongoDB.', error.message) )


const personSchema = new mongoose.Schema({
  name: { type: String, required:true, minlength: 3 },
  number: { type: String, required:true, minlength: 8 }
})

personSchema.plugin(uniqueValidator)

personSchema.pre('findOneAndUpdate', function(next) {
  this.options.runValidators = true
  next()
})


personSchema.set( 'toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)