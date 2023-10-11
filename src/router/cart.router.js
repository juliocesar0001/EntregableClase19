const Router=require('express').Router
const router=Router()
const path=require('path')
const cartsModelo=require("../dao/models/carts.modelo.js")
const productsModelo=require("../dao/models/products.modelo.js")
var fs = require('fs');

let ruta=path.join(__dirname,"..",'data','carts.json')
let rutaProductos=path.join(__dirname,"..",'data','productos.json')

function getCarts(){
    if(fs.existsSync(ruta)){
        return JSON.parse(fs.readFileSync(ruta,'utf-8'))
    }else{return []}
}

function getCartById(cid){
    let isPresent=false;
    let location=-1;
    let i=-1;
    let carts = getCarts()
    console.log(carts)
    if (carts.length==undefined){
        if (carts.id==cid){return carts}
        return ("Not Found")
    }
    carts.forEach(element => { 
        i++;
        if (element.id == cid) 
        {
            isPresent=true;
            location=i;
        }
    });
    if (isPresent) {return carts[location]}
    return ("Not Found")
}

function getProductById(id){
    let isPresent=false;
    let location=-1;
    let i=-1;
       
    let products = JSON.parse(fs.readFileSync(rutaProductos,'utf-8'))
    products.forEach(element => { 
        i++;
        if (element.id == id) 
        {
            isPresent=true;
            location=i;
        }
        
    });
    if (isPresent) {return products[location]}
    return ("Not Found")
}

function addProdToCart(cid,pid){
    let cart=getCartById(cid)    
    let prod=getProductById(pid)
    let isPresent=false;
    let location=-1;
    let i=-1;
    if (prod=="Not Found"){return "10"}
    if (cart=="Not Found"){return "01"}
    cart.products.forEach(element => { 
        i++;
        if (element.id == pid) 
        {
            isPresent=true;
            location=i;
        }  
    });
    if (isPresent){
            cart.products[location].quantity=cart.products[location].quantity+1}
    else{
        let newProd={
            quantity:1,
            id:pid
        }
        cart.products.push(newProd);
    }
    fs.writeFileSync(ruta, JSON.stringify(cart), function (err) {if (err) throw err;});
    return (0)
}

//-------------------------------------------------------

router.post('/:pid',async(req,res)=>{
    let pid=req.params.pid
    let newCart={
        products:[],
    }
    let id=req.params.pid
    let producto =await productsModelo.findById(pid)
    let tempProd = {id:pid,quantity:1}
    newCart.products.push(tempProd)
    let resultado = await cartsModelo.create(newCart)
    return res.status(400).json({resultado})
})

router.post("/",async(req,res)=>{

   /* const newCart = req.body
 
    if(!newCart.id || !newCart.products || !newCart){
      res.status(400).send("Complete todos los campos de la solicitud")
    }
     else{
        const carro = getCarro(carrito)
        newCart.id = carro.length + 1
        carro.push(newCart)
        saveCart(carro)
        res.status(200).send("Producto añadido al carrito")
     }*/

     
    let pid=req.params.pid
    let newCart={
        products:[],
    }
    let id=req.params.pid
    let producto =await productsModelo.findById(pid)
    let tempProd = {id:pid,quantity:1}
    newCart.products.push(tempProd)
    let resultado = await cartsModelo.create(newCart)
    return res.status(400).json({resultado})
 })

router.get('/:cid',async(req,res)=>{
    /*let id=parseInt(req.params.cid)
    if(isNaN(id)){
        return res.status(400).json({error:'El id debe ser numerico'})
    }
    let cart=await  cartsModelo.findById(id)
    res.status(200).json({data:cart})*/

    let id=req.params.cid
    let cart =await  cartsModelo.findById(id)
    res.status(200).json({data:cart})
})

router.post('/:cid/product/:pid',async(req,res)=>{
    let cId=req.params.cid
    let pId=req.params.pid

    let carrito = await cartsModelo.findOne({'_id':cId})
    let alreadyPresent = carrito.products.find(product=> product._id === pId)
    if (alreadyPresent){
        alreadyPresent.quantity ++
        let response = await cartsModelo.updateOne({_id:cId, 'products._id':pId},{$set:{'products.quantity':alreadyPresent.quantity}})
    }   
    else{
        carrito.products.push({quantity:1,_id:pId})
    }

    await carrito.save();
    carrito = await cartsModelo.findOne({_id:cId});
    return res.status(400).json({carrito})
})

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
  
        const cart = await cartsModel.findOne({ id: parseInt(cid) });
  
        if (!cart) {
            return res.status(404).json({ error: "No se encontro"});
        }
  
        cart.products = cart.products.filter(product => product.product !== parseInt(pid));
  
        await cart.save();
  
        res.status(200).json({ message: "Producto eliminado del carrito", cart });
    } catch (error) {
        res.status(500).json({ error:"Erro", detalle: error.message });
    }
  })

  router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
  
        const cart = await cartsModel.findOne({ id: parseInt(cid) });
  
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
  
        cart.products = [];
 
        await cart.save();

        res.status(200).json({ message: 'Todos los productos del carrito han sido eliminados', cart });
    } catch (error) {
        res.status(500).json({ error: 'Error inesperado', detalle: error.message });
    }
})

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
  
        const cart = await cartsModel.findOne({ id: parseInt(cid) });
  
        if (!cart) {
            return res.status(404).json({ error:"No se encontro" });
        }
  
        cart.products = products;
  
        await cart.save();
  
        res.status(200).json({ message: "Carrito actualizado", cart });
    } catch (error) {
        res.status(500).json({ error:"Error", detalle: error.message });
    }
})

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
  
        const cart = await cartsModel.findOne({ id: parseInt(cid) });
  
        if (!cart) {
            return res.status(404).json({ error: "No se encontro"});
        }
  
        const productToUpdate = cart.products.find(product => product.product === parseInt(pid));
  
        if (!productToUpdate) {
            return res.status(404).json({ error: "Producto no encontrado en el carrito" });
        }
  
        productToUpdate.quantity = quantity;
  
        await cart.save();
  
        res.status(200).json({ message: "Cantidad de producto actualizada con éxito", cart });
    } catch (error) {
        res.status(500).json({ error: "Error", detalle: error.message });
    }
  })

module.exports=router