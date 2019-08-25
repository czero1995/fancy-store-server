const mongoose = require('./index.js')

const CategorySchema = mongoose.Schema({
  title: { type: String, require: true }
})

module.exports = mongoose.model('category', CategorySchema)
