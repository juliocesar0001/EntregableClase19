const socket = io();

const form = document.querySelector("#form")

const pr = []

function enviar(e){
    e.preventDefault()

const title = document.querySelector("#title").value
const description = document.querySelector("#description").value
const price = document.querySelector("#price").value
const thumbnail = document.querySelector("#thumbnail").value
const code = document.querySelector("#code").value
const stock = document.querySelector("#stock").value


const newProduct = {

    title:title,
    description:description,
    price:price,
    thumbnail:thumbnail,
    code:code,
    stock:stock

}
pr.push(newProduct)

socket.on("nombre",data=>{   
   
    data.emit("newProduct",newProduct)
  
  })
}

form.addEventListener("submit",enviar)
 
s.on("connection",sock=>{sock.emit("data","hola")})

