const mongoose = require('mongoose')
const config = require('../../config/config')
mongoose.connect(config.dbConnect)

const models = {
  user: {
    user: { type: String, require: true },
    pwd: { type: String, require: true },
    avatar: { type: String, default: '' },
    sex: { type: String },
    carts: { type: Array },
    order: {
      type: Array
    },
    address: {
      type: Array
    }
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
