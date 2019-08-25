const mongoose = require('./index.js')

const AdminSchema = mongoose.Schema({
  admin: { type: String, require: true },
  pwd: { type: String, require: true },
  avatar: { type: String },
  roles: { type: Array }
})

module.exports = mongoose.model('admin', AdminSchema)
