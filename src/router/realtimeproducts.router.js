const Router = require("express").Router
const router = Router()
const path = require("path")
const handleBars = require("express-handlebars")
const fs = require("fs")

const products = path.join(__dirname,"..","..","archivos","productos.json")

function getProducts(products){
    return  JSON.parse(fs.readFileSync(products))
}

router.get("/",(req,res)=>{
    const product = getProducts(products)

    res.status(200).render("main",{
        products:product       
        })
})

module.exports = router

