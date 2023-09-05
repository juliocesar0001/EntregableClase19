const Router=require('express').Router
const router=Router()
const express = require('express')
const productManager = require("../productManager")


const path=require('path')
var fs = require('fs');

let ruta=path.join(__dirname,"..","..",'archivos','productos.json') 

const pproductManager=new productManager(ruta)

function addProduct (title, description, price, code, stock){
    let newProduct={
        title,
        description,
        price,
        code,
        stock,
        id:0
    }

    let isPresent=false;
    let productos = getProductss()
    productos.forEach(element => {if (element.code==code){isPresent=true}})

    if (!isPresent){
        if (productos.length===0){
            newProduct.id=1
        }else{
            newProduct.id = productos[productos.length -1].id + 1
        }

        productos.push(newProduct);
        fs.writeFileSync(ruta, JSON.stringify(productos), function (err) {if (err) throw err;});
    }
    else{
        return "66"
    }
}

function getProductss(){
    if(fs.existsSync(ruta)){
        return JSON.parse(fs.readFileSync(ruta,'utf-8'))
    }else{return []}
}

function updateProduct(id,tempProd){
   let isPresent=false;
    let location=-1;
    let i=-1;
    let products = getProductss()
    products.forEach(element => { 
        i++;
        if (element.id == id) 
        {
            isPresent=true;
            location=i;
        }
        
    });
    if (isPresent) {
        products[location]=tempProd;
        fs.unlinkSync(ruta, function (err) {if (err) throw err;});
        fs.openSync(ruta, 'w',0o666 ,function (err, file) {if (err) throw err}); 
        fs.writeFileSync(ruta, JSON.stringify(products), function (err) {if (err) throw err;});
        return "0"
    }
    return "66"
}

function saveProducts(products){
    fs.writeFileSync(ruta, JSON.stringify(products, null, 5))    
}

function getProductById(id){
    let isPresent=false;
    let location=-1;
    let i=-1;
    let products = getProductss()
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

function deleteProduct(id){
    let i=-1;
    let logrado=false;
    let products = getProductss()

    products.forEach(element => { 
        i++;
        if (element.id == id) 
        {
            products.splice(i,1)
            logrado=true
        }
    });
    if (logrado){
        fs.unlinkSync(ruta, function (err) {if (err) throw err;});
        fs.openSync(ruta, 'w',0o666 ,function (err, file) {
            if (err) throw err;
        }); 
        fs.writeFileSync(ruta, JSON.stringify(products), function (err) {if (err) throw err;});
        return "0"
    }
    return "1"
}

//-------------

router.get('/',(req,res)=>{
    
    let filtros=Object.entries(req.query)
    let products=getProductss()
    if (filtros.length>0){
        if (filtros[0][0]=="limit") {
            let limit=parseInt(filtros[0][1])
            if (limit>products.length){res.json(products)}
            else{
                let resultados=[]
                for (let index = 0; index < limit; index++) {
                    resultados.push(products[index])
                }
                res.setHeader('Content-Type','application/json');
                res.status(200).json({data:resultados});
            }
        }
        else{res.json("Invalid Parameter")} 
    }
    else{
        res.setHeader('Content-Type','application/json');
        res.status(200).json({data:products});
    }
})

router.get('/:pid',(req,res)=>{
    let id=parseInt(req.params.pid)
    if(isNaN(id)){
        return res.status(400).json({error:'El id debe ser numerico'})
    }
    let producto=getProductById(id)
    res.status(200).json({data:producto})
})

router.get('*',(req, res)=>{
    res.send('error 404 - page not found')
})

router.post('/',(req,res)=>{
    let {
        title,
        description,
        price,
        code,
        stock
    } = req.body
    console.log(req.body)
    error=addProduct(title,description,price,code,stock)
    if (error=="66"){
        res.status(400).json("el codigo de producto ya existe. Debe ingresar un codigo diferente.")
    }
    else{
        res.status(200).json("Producto Agregado")
    }
})

router.put('/:pid',(req,res)=>{
    let id=parseInt(req.params.pid)
    if(isNaN(id)) {
        return res.status(400).json({error:'El id del producto debe ser numerico'})
    }

    let {
        title,
        description,
        price,
        code,
        stock
    } = req.body
    let tempProd={
        title,
        description,
        price,
        code,
        stock,
        id:0
    }
    tempProd.id=id;

    let error = updateProduct(id,tempProd)
    if (error=="0"){return res.status(200).json('success')}
    else {return res.status(400).json({error:'Product not found'})}
})

router.delete('/:pid',(req,res)=>{
    let id=parseInt(req.params.pid)
    if(isNaN(id)) {
        return res.status(400).json({error:'El id del producto a borrar debe ser numerico'})
    }

    let error = deleteProduct(id)
    if (error=="0"){return res.status(200).json('success')}
    else {return res.status(400).json({error:'Product not found'})}

})

module.exports = router