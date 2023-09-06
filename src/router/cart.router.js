const Router=require('express').Router
const router=Router()
const path=require('path')
var fs = require('fs');

let ruta=path.join(__dirname,"..","..",'archivos','carts.json')
let rutaProductos=path.join(__dirname,"..","..",'archivos','productos.json')

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


router.post('/:pid',(req,res)=>{
    let pid=parseInt(req.params.pid)
    let newCart={
        products:[],
        id:0
    }
    let carts = getCarts()
    console.log(carts.id)
    if (carts.length===0){
        newCart.id=1
    }else{
        newCart.id = carts[carts.length -1].id + 1
    }
    let newP={id: pid, quantity:1}
    newCart.products.push(newP)
    carts.push(newCart);
    fs.writeFileSync(ruta, JSON.stringify(carts), function (err) {if (err) throw err;});
    res.setHeader('Content-Type','application/json');
    res.status(200).json({newCart});
})

router.post("/",(req,res)=>{

    const newCart = req.body
 
    if(!newCart.id || !newCart.products || !newCart){
      res.status(400).send("Complete todos los campos de la solicitud")
    }
     else{
        const carro = getCarro(carrito)
        newCart.id = carro.length + 1
        carro.push(newCart)
        saveCart(carro)
        res.status(200).send("Producto añadido al carrito")
     }
 })

router.get('/:cid',(req,res)=>{
    let id=parseInt(req.params.cid)
    if(isNaN(id)){
        return res.status(400).json({error:'El id debe ser numerico'})
    }
    let cart=getCartById(id)
    res.status(200).json({data:cart})
});


router.post('/:cid/product/:pid',(req,res)=>{
    let cartId=parseInt(req.params.cid)
    console.log("ID del carrito ingresado:")
    console.log(cartId)

    let prodId=parseInt(req.params.pid)
    console.log("ID del producto ingresado:")
    console.log(prodId)
    console.log("llamando al metodo addProdToCart")
    let result=addProdToCart(cartId,prodId)
    console.log("Resutado de llamar al metodo:")
    console.log(result)
    if (result=="01"){return res.status(400).json({error:'Cart not found'})}
    if (result=="10"){return res.status(400).json({error:'Prod not found'})}
    if (result=="0"){return res.status(200).json({data:'Success'})}
    
})

module.exports=router