const mongoose = require('./index.js')

const BannerSchema = mongoose.Schema({
  title: { type: String },
  img: { type: String },
  url: { type: String }
})

module.exports = mongoose.model('banner', BannerSchema)
