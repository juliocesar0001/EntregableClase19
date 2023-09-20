const express = require('express')
const productsRouter = require("./router/products.router")
const cartsRouter=require('./router/cart.router')

const realtimeprod = require("./router/realtimeproducts.router")
const handlebars = require("express-handlebars")
const s = require("socket.io").Server

const fs = require('fs')
const productManager = require("../src/productManager")

const app = express()
const PORT = 8080

const path = "../archivos/productos.json" 
const pproductManager = new productManager(path)

app.engine("handlebars", handlebars.engine())
app.set("view engine","handlebars")
app.set("views", __dirname + "\\views")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(__dirname+'/public'))

app.use('/api/products', productsRouter)
app.use('/api/carts',cartsRouter)
app.use("/realtimeproducts",realtimeprod)

/*app.get('/demon',(req,res)=>{
    
    res.setHeader('Content-Type','application/json');
    res.status(200).json("productos")
});

app.post('/demon',(req,res)=>{
    
    let personaje=req.body
    // faltan validaciones y falta agregrar ID único...!!!

    demonSlayer.push(personaje)
    serverSocket.emit('nuevoPersonaje',personaje, demonSlayer)

    res.setHeader('Content-Type','application/json');
    res.status(201).json(personaje);
});*/

const serverExpress =app.listen(PORT, () => {
    console.log(`Server corriendo en puerto ${PORT}`)
})

const serverSocket = new s(serverExpress)

/*serverSocket.on("connection",socketss=>{
    //let nombre = "julio"
    console.log(`Se ha conectado un cliente con id ${socketss.id}`)
    serverSocket.on("newProduct",data =>{
        console.log(data)
        console.log("aaa")
      })
})*/

serverSocket.on("connection",socket=>{
    console.log(`Se ha conectado un cliente con id ${socket.id}`)

    socket.emit('bienvenida',{message:'Bienvenido al server...!!! Por favor identifiquese'})

    socket.on('identificacion',nombre=>{
        console.log(`Se ha conectado ${nombre}`)
        socket.emit('idCorrecto',{message:`Hola ${nombre}, bienvenido...!!!`})
        socket.broadcast.emit('nuevoUsuario', nombre)
    })
})

