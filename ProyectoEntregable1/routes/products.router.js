const Router=require("express").Router
const router=Router()
const path=require("path")
var fs = require("fs");

let ruta=path.join(__dirname,"../archivos","products.json") 

function addProduct (title, description, price, thumbnail, code, stock){

    let newProduct={
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        id:0
    }

    let isPresent=false;
    let productos = getProducts()
    productos.forEach(element => {if (element.code==code){isPresent=true}});

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

function getProducts(){
    if(fs.existsSync(ruta)){
        return JSON.parse(fs.readFileSync(ruta,"utf-8"))
    }else{return []}
}

function getProductById(id){

    let isPresent=false;
    let location=-1;
    let i=-1;
    let products = getProducts()
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

function updateProduct(id,tempProd){
    let isPresent=false;
    let location=-1;
    let i=-1;
    let products = getProducts()
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
        fs.openSync(ruta, "w",0o666 ,function (err, file) {if (err) throw err}); 
        fs.writeFileSync(ruta, JSON.stringify(products), function (err) {if (err) throw err;});
        return "0"
    }
    return "66"
}

function deleteProduct(id){
    let i=-1;
    let logrado=false;
    let products = getProducts()

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
        fs.openSync(ruta, "w",0o666 ,function (err, file) {
            if (err) throw err;
        }); 
        fs.writeFileSync(ruta, JSON.stringify(products), function (err) {if (err) throw err;});
        return "0"
    }
    return "1"
}


router.get("/",(req,res)=>{
    let products=getProducts()
    res.setHeader("Content-Type","application/json");
    res.status(200).json({data:products});
});

router.get("/:pid",(req,res)=>{
    let id=parseInt(req.params.pid)
    if(isNaN(id)){
        return res.status(400).json({error:"El id debe ser numerico"})
    }
    let producto=getProductById(id)
    res.status(200).json({data:producto})
});

router.post("/",(req,res)=>{
   let {
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    } = req.body
    console.log(req.body)
    error=addProduct(title,description,price,thumbnail,code,stock)
    if (error=="66"){
        res.status(400).json("el codigo de producto ya existe. Debe ingresar un codigo diferente.")
    }
    else{
        res.status(200).json("Producto Agregado")
    }

});

router.put("/:pid",(req,res)=>{
    let id=parseInt(req.params.pid)
    if(isNaN(id)) {
        return res.status(400).json({error:"El id del producto debe ser numerico"})
    }

    let {
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    } = req.body
    let tempProd={
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        id:0
    }
    tempProd.id=id;

    let error = updateProduct(id,tempProd)
    if (error=="0"){return res.status(200).json("success")}
    else {return res.status(400).json({error:"Product no encontrado"})}
});

router.delete("/:pid",(req,res)=>{
    let id=parseInt(req.params.pid)
    if(isNaN(id)) {
        return res.status(400).json({error:"El id esta mal"})
    }

    let error = deleteProduct(id)
    if (error=="0"){return res.status(200).json("success")}
    else {return res.status(400).json({error:"Product no encontrado"})}

});


module.exports=router