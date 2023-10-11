const Router = require('express').Router
const router=Router()

const auth=(req, res, next)=>{
    if(req.session.usuario){
        next()
    }else{
        return res.redirect('/login')
    }
}

const auth2=(req, res, next)=>{
    if(req.session.usuario){
        console.log('auth2 me manda a products')

        return res.redirect('/products')
    }else{
        next()
    }
}

router.get('/',(req,res)=>{
    let verLogin=true
    if(req.session.usuario){
        verLogin=false
    }
    res.status(200).render('home',{
        verLogin
    })
})

router.get('/chat',auth,(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('chat');
})

router.get('/login',auth2,(req,res)=>{

    res.status(200).render('login',{
        verLogin:true
    })
})

router.get('/products',auth, (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('products',{
        verLogin:false,
        usuario: req.session.usuario
    })
})

router.get('/signup',auth2,(req,res)=>{

    res.status(200).render('signup',{
        verLogin:true
    })
})


module.exports=router
