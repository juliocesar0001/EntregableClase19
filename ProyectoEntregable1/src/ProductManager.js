const fs = require("fs")

const express=require('express')
const path=require('path')

let ruta=path.join(__dirname,'archivos','archivo1.json') 

const app=express()
const PORT=3000

app.listen(PORT,()=>{
    console.log(`server corriendo`)
})


class ProductManager {
    constructor(path) {
        this.Products = []
        this.path = path
    }

    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.Products, null, '\t'));
    }


    addProducts(title, description, price, thumbnail, code, stock) {

        const productExists = this.Products.some(
            product => product.title === title && product.code === code
        );

        if (productExists) {
            console.log("Ya existe este producto")
        }

        let nuevoProducts = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        let numeroId = nuevoProducts.id;

        if (nuevoProducts.id === numeroId) {
            console.log("No se pueden ingresar 2 productos con el mismo Id")
        }

        if (this.Products.length === 0) {
            nuevoProducts.id = 1
        } else {
            nuevoProducts.id = this.Products[this.Products.length - 1].id + 1
        }

        this.Products.push(nuevoProducts)
    }

    getProducts() {
        return this.Products
    }

    getProductById(idProducts) {

        let indiceProducts = this.Products.findIndex(producto => producto.id === idProducts)

        if (indiceProducts === -1) {
            console.log(`El producto ${idProducts} no existe...!!!`)
            return
        }

        return this.Products[indiceProducts]

    }

    updateProduct(id, field, value) {
        const productUpdate = this.Products.find(product => product.id === id);
        if (!productUpdate) {
            console.log(`No existe producto con id: ${id}.`);
            return;
        }
        productUpdate[field] = value;
        this.saveProducts();
    }

    deleteProduct(id) {
        const indexDelete = this.Products.findIndex(product => product.id === id);
        if (indexDelete === -1) {
            console.log(`No existe producto con id: ${id}.`);
            return;
        }

        this.Products.splice(indexDelete, 1);
        this.saveProducts();
    }

}

let path = './archivos/archivo1.json'


let pm = new ProductManager(path);
console.log(pm.getProducts());


console.log(pm.getProducts())
pm.addProducts('afterClass 01', 'remoto x zoom', 100, 5, 5, 13)
pm.addProducts('Clase 4', 'remoto x zoom', 100, 100, 5, 5, 13)
pm.addProducts('Clase 5', 'remoto x zoom', 100, 100, 5, 5, 13)

const product = pm.getProductById(3);

if (product !== undefined) {
    console.log("Producto encontrado:", product);
    fs.writeFileSync(path, JSON.stringify(product, null, '\t'))
}

pm.updateProduct(2, 'price', 250);
console.log(pm)

pm.deleteProduct(1);
console.log(pm.getProducts())

