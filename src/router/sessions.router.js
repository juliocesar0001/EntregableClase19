const Router = require('express').Router
const router=Router()
const crypto=require('crypto')
const usersModel=require("../dao/models/session.model.js")

router.post('/signup',async(req,res)=>{

    let {name, email, password}=req.body

    if(!name || !email || !password){
        return res.status(400).send('Data incomplete')
    }

    let existe=await usersModel.findOne({email})
    if(existe){
        return res.status(400).send(`User already exist: ${email}`)
    }

    password=crypto.createHmac('sha256','palabraSecreta').update(password).digest('base64')

    await usersModel.create({
        name, email, password
    })

    res.redirect(`/login?newUser=${email}`)
})

router.post('/login',async(req,res)=>{

    let {email, password}=req.body

    if(!email || !password) {
        return res.send('Data incomplete')
    }

    password=crypto.createHmac('sha256','palabraSecreta').update(password).digest('base64')

    let usuario=await usersModel.findOne({email, password})

    if(!usuario){
        return res.status(401).send('Email or password incorrect')
    }

    if (usuario.email === "adminCoder@coder.com"){
        req.session.usuario={
            name: usuario.name,
            email: usuario.email,
            rol: "admin"
        }
    }
    else{
        req.session.usuario={
            name: usuario.name,
            email: usuario.email,
            rol: "user"
        }
    }

    res.redirect('/products')
})

router.get('/logout',(req,res)=>{

    req.session.destroy(e=>console.log(e))

    res.redirect("/login?mensaje=logout correcto...!!!")
})

module.exports=router