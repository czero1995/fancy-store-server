const mongoose = require('mongoose')
const config = require('../../config/config')
mongoose.connect(config.dbConnect)

const models = {
  product: {
    title: { type: String, require: true },
    detailInfo: { type: Object },
    priceNow: { type: String },
    priceOrigin: { type: String },
    imgCover: { type: String },
    category: { type: String }
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
