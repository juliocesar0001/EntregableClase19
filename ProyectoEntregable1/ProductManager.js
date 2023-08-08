class ProductManager{
    constructor(){
        this.Products=[]
    }

    addProducts(title, description, price, thumbnail,code,stock){
        let nuevoProducts={
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        let numeroId=nuevoProducts.id;

        if(nuevoProducts.id===numeroId){
            console.log("No se pueden ingresar 2 productos con el mismo Id")
        }

        if(this.Products.length===0){
            nuevoProducts.id=1
        }else{
            nuevoProducts.id=this.Products[this.Products.length -1].id + 1
        }


        this.Products.push(nuevoProducts)

    }

    getProducts(){
        return this.Products
    }

    getProductById(idProducts){

        let indiceProducts=this.Products.findIndex(producto=>producto.id===idProducts)

        if(indiceProducts===-1){
            console.log(`El producto ${idProducts} no existe...!!!`)
            return
        }

        return this.Products[indiceProducts]

    }

}

let pm=new ProductManager();

console.log(pm.getProducts())
pm.addProducts('afterClass 01', 'remoto x zoom', 100,5,5,13)
pm.addProducts('Clase 4', 'remoto x zoom', 100,100,5,5,13)
pm.addProducts('Clase 5', 'remoto x zoom', 100,100,5,5,13)

console.log(pm.getProducts())
