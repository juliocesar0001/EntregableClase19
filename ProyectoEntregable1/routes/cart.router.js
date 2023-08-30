const Router=require("express").Router
const router=Router()
const path=require("path")
var fs = require("fs");

let ruta=path.join(__dirname,"../archivos","carts.json") 
let rutaProductos=path.join(__dirname,"../archivos","archivo1.json") 

function getCarts(){
    if(fs.existsSync(ruta)){
        return JSON.parse(fs.readFileSync(ruta,"utf-8"))
    }else{return []}
}

function getCartById(id){

    let isPresent=false;
    let location=-1;
    let i=-1;
    let carts = getCarts()
    console.log(carts)
    console.log(carts.products[0])
    carts.forEach(element => { 
        i++;
        if (element.id == id) 
        {
            isPresent=true;
            location=i;
        }
        
    });
    if (isPresent) {return carts[location]}
    return ("no encontrado")
}

function getProductById(id){

    let isPresent=false;
    let location=-1;
    let i=-1;
       
    let products = JSON.parse(fs.readFileSync(rutaProductos,"utf-8"))
    products.forEach(element => { 
        i++;
        if (element.id == id) 
        {
            isPresent=true;
            location=i;
        }
        
    });
    if (isPresent) {return products[location]}
    return ("no encontrado")
}

function addProdToCart(cid,pid){
    let cart=getCartById(cid)    
    let prod=getProductById(pid)
    let isPresent=false;
    let location=-1;
    let i=-1;
    if (prod=="no encontrado"){return "10"}
    if (cart=="no encontrado"){return "01"}
    cart.products.forEach(element => { 
        i++;
        if (element.id == id) 
        {
            isPresent=true;
            location=i;
        }  
    });
    if (isPresent){cart.products[location].quantity=cart.products[location].quantity+1}
    else{
        let newProd={
            quantity:1,
            id:pid
        }
        cart.products.push(newProd);
        fs.writeFileSync(ruta, JSON.stringify(cart), function (err) {if (err) throw err;});
        return (0)
    }

}


router.post("/",(req,res)=>{
    let newCart={
        products:[],
        id:0
    }
    let carts = getCarts()
    if (carts.length===0){
        newCart.id=1
    }else{
        newCart.id = carts[carts.length -1].id + 1
    }

    carts.push(newCart);
    fs.writeFileSync(ruta, JSON.stringify(carts), function (err) {if (err) throw err;});
    res.setHeader("Content-Type","application/json");
    res.status(200).json({newCart});
});

router.get("/:cid",(req,res)=>{
    let id=parseInt(req.params.cid)
    if(isNaN(id)){
        return res.status(400).json({error:"El id debe ser numerico"})
    }
    let cart=getCartById(id)
    res.status(200).json({data:cart})
});


router.post("/:cid/product/:pid",(req,res)=>{
    let cartId=parseInt(req.params.cid)
    let prodId=parseInt(req.params.pid)

    let result=addProdToCart(cartId,prodId)
    if (result=="01"){return res.status(400).json({error:"Cart no encontrado"})}
    if (result=="10"){return res.status(400).json({error:"Prod no encontrado"})}
    if (result=="0"){return res.status(200).json({data:"Success"})}
    
});


module.exports=router