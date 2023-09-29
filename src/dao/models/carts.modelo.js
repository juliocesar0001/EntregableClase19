const mongoose = require("mongoose")

const cartCollection = "carts"
const cartEsquema = new mongoose.Schema({
    products:[
        {
            _id: { type : String , require : true},
            quantity: { type : Number, require:true}
        }
    ]},{collection:'carts'})

const cartsModel = mongoose.model( cartCollection , cartEsquema )

module.exports = cartsModel