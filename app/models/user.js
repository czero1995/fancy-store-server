const mongoose = require('./index.js')

const UserSchema = mongoose.Schema({
  user: { type: String, require: true },
  pwd: { type: String, require: true },
  avatar: { type: String, default: '' },
  sex: { type: String },
  carts: { type: Array },
  order: { type: Array },
  address: { type: Array }
})

module.exports = mongoose.model('user', UserSchema)
