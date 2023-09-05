const fs = require('fs')

class productManager {

    constructor(path) {
        this.products = []
        this.path = path
    }

    async saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, '\t'))
    }

    async updateProduct(id, field, value) {
        const productToUpdate = this.products.find(product => product.id === id)
        if (!productToUpdate) {
            console.log(`Error: No se encontró ningún producto con el ID ${id}.`)
            return
        }
        productToUpdate[field] = value
        this.saveProducts()
    }

    async deleteProduct(id) {
        const indexToDelete = this.products.findIndex(product => product.id === id)
        if (indexToDelete === -1) {
            console.log(`Error: No se encontró ningún producto con el ID ${id}.`)
            return
        }

        this.products.splice(indexToDelete, 1)
        this.saveProducts()
    }

    async addProducts(title, description, price, code, stock) {
        const productExists = this.products.some(
            product => product.title === title && product.code === code
        )

        if (productExists) {
            console.log((`Error: Ya existe un producto con el mismo título y código.`))
        }

        let nuevoProduct = {
            title,
            description,
            price,
            code,
            stock
        }
        if (this.products.length === 0) {
            nuevoProduct.id = 1
        } else {
            nuevoProduct.id = this.products[this.products.length - 1].id + 1
        }

        this.products.push(nuevoProduct)
    }

    async getProducts() {
        return this.products
    }

    async getProductss() {
        const jsonData = fs.readFileSync(this.path, "utf-8")
        const products = JSON.parse(jsonData)
        return products
    }

    async getProductById(idProduct) {
        let indiceProd = this.products.findIndex(producto => producto.id === idProduct)

        if (indiceProd === -1) {
            console.log(`El evento ${idProduct} no existe...!!!`)
            return
        }
        return this.products[indiceProd]
    }
}


let path = "../archivos/productos.json"
let pm = new productManager(path)

console.log(pm.getProducts())
pm.addProducts('afterClass 01', 'remoto x zoom', 5, 5, 13)
pm.addProducts('Clase 4', 'remoto x zoom', 100, 5, 5, 13)
pm.addProducts('Clase 5', 'remoto x zoom', 100, 5, 5, 13)

const product = pm.getProductById(3)
/*
if (product !== undefined) {
    console.log("Producto encontrado:", product);
    fs.writeFileSync(path, JSON.stringify(product, null, '\t'))
}*/

//pm.updateProduct(2, 'price', 250)
//console.log(pm)
//console.log(pm.getProductss(), "assaassaas")
//pm.deleteProduct(1)
console.log(pm.getProducts())

module.exports = productManager