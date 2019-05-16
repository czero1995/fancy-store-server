const mongoose = require('mongoose')
const config = require('../../config/config')
mongoose.connect(config.dbConnect)

const models = {
  admin: {
    admin: { type: String, require: true },
    pwd: { type: String, require: true },
    avatar: { type: String },
    roles: { type: Array }
  }
}

for (let m in models) {
  mongoose.model(m, new mongoose.Schema(models[m]))
}

module.exports = {
  getModel: function(name) {
    return mongoose.model(name)
  }
}
