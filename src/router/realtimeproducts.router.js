const Router = require("express").Router
const router = Router()
const path = require("path")
const handleBars = require("express-handlebars")
const fs = require("fs")

let ruta=path.join(__dirname,"..","..",'archivos','productos.json') 
const products = path.join(__dirname,"..","..","archivos","productos.json")

const json = fs.readFileSync(path.join(__dirname,"..","..","archivos","productos.json"), 'utf-8');
let prodi = JSON.parse(json);

function getProductss(){
    if(fs.existsSync(ruta)){
        return JSON.parse(fs.readFileSync(ruta,'utf-8'))
    }else{return []}
}

function saveProducts(prod){
    fs.writeFileSync(products,JSON.stringify(prod))
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

router.get("/",(req,res)=>{
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
                res.setHeader('Content-Type','text/html')
                //res.status(200).render({data:resultados})
                res.status(200).render('home',{resultados})
            }
        }
        else{res.json("Invalid Parameter")} 
    }
    else{
        res.setHeader('Content-Type','text/html')
        res.status(200).render('home',{products})
        
        //res.status(200).render({data:products})
    }
})

router.post('/', (req, res) => {
    const { title, description, price, thumbnail,code,stock } = req.body
  
    if (!title || !description || !price || !thumbnail|| !code|| !stock) {
      res.status(400).send("Entries must have a title and body");
      return;
    }
  
    var newBook = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id: 0
    };
  let product=getProductss()

    prodi.push(newBook)
    newBook.id = product[product.length -1].id + 1

    const json_books = JSON.stringify(prodi);
    fs.writeFileSync(path.join(__dirname,"..","..","archivos","productos.json"), json_books, 'utf-8');
  
    res.redirect('/realtimeproducts')
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

