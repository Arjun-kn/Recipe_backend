let mongoose = require('mongoose')


const userchema = new mongoose.Schema({
    email:{type:String,required:true},
    password:{type:String,required:true}
})


let usermodel = mongoose.model('User',userchema);

module.exports = usermodel