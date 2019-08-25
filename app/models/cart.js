const mongoose = require('./index.js')

const CartSchema = mongoose.Schema({
  cartId: { type: String }
})

module.exports = mongoose.model('cart', CartSchema)
