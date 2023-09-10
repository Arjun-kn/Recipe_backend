let mongoose = require('mongoose');

let postSchema = new mongoose.Schema({
    title:{type:String,required:true},
    ingredients:{type:Array, required:true},
    instruction:{type:String,required:true},
    imageUrl : {type:String},
    author:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}
})

let postmodel = mongoose.model('Recipe',postSchema);

module.exports = postmodel;