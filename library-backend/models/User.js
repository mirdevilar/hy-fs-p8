const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  username: {
    minlength: 1,
    required: true,
    type: String,
    unique: true,
  },
  favoriteGenre: {
    type: String,
  }
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('User', schema)