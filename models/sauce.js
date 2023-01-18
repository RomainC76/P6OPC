//imort de mongoose
const mongoose = require('mongoose');

//on crée le schéma de données
const sauceSchema = mongoose.Schema({
    userId: {type: String, required:true},
    name: {type:String, required:true},
    manufacturer: {type:String, required:true},
    description: {type:String, required:true},
    mainPepper: {type:String, required:true},
    imageUrl: {type:String, required:true},
    heat: {type:Number, required:true},
    likes: {type:Number, required:true},
    dislikes: {type:Number, required:true},
    usersLiked: {type:[String], required:false},
    usersDisliked: {type:[String], required:false}
});

//on exporte le modèle
module.exports = mongoose.model('Sauce', sauceSchema)