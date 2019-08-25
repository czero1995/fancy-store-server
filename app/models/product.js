const mongoose = require('./index.js')

const ProductSchema = mongoose.Schema({
  title: { type: String, require: true },
  detailInfo: { type: Object },
  priceNow: { type: String },
  priceOrigin: { type: String },
  imgCover: { type: String },
  category: { type: String }
})

module.exports = mongoose.model('product', ProductSchema)
