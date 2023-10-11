const mongoose=require('mongoose')

const usersModel=mongoose.model('usersData', new mongoose.Schema({
    name: String,
    email: {
        type: String, unique: true
    },
    password: String
}))

module.exports=usersModel