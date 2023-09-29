const mongoose=require("mongoose")

const productsCollection = 'products'
const productsEsquema = new mongoose.Schema({
    title:{
        type: String, require:true
    },
    description: {
        type: String, require: true
    },
    price: {
        type: String, require: true
    },
    thumbnail: {
        type: String, require: false
    },
    code: {
        type: String, require: true, unique:true
    },
    stock: {
        type: Number, require: true
    }
},{collection:'products'})

const productsModel = mongoose.model(productsCollection, productsEsquema)

module.exports = productsModel