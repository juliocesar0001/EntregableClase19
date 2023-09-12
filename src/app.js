const express = require('express')
const productsRouter = require("./router/products.router")
const cartsRouter=require('./router/cart.router')

const handler = require("./router/realtimeproducts.router")
const handleBars = require("express-handlebars")
const s = require("socket.io").Server

const fs = require('fs')
const productManager = require("../src/productManager")


const app = express()
const PORT = 8080

const path = "../archivos/productos.json"
const pproductManager = new productManager(path)

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.engine("handlebars", handleBars.engine())
app.set("views", __dirname + "\\vista");
app.set("view engine","handlebars")

//app.use(express.static(path.join(__dirname,"/public")))

app.use('/api/products', productsRouter)
app.use('/api/carts',cartsRouter)

app.use("/realtimeproducts",handler)

const serverExpress =app.listen(PORT, () => {
    console.log(`Server corriendo en puerto ${PORT}`)
})



const serverSocket = new s(serverExpress)

serverSocket.on("connection",socket=>{
    let nombre = "julio"
    console.log(`identificacion ${socket.id}`)
    console.log("a")
})

