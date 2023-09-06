const express = require('express')
const productsRouter = require("./router/products.router")
const cartsRouter=require('./router/cart.router')

const fs = require('fs')
const productManager = require("../src/productManager")


const app = express()
const PORT = 8080

const path = "../archivos/productos.json"
const pproductManager = new productManager(path)

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/products', productsRouter)
app.use('/api/carts',cartsRouter)

app.listen(PORT, () => {
    console.log(`Server corriendo en puerto ${PORT}`)
})