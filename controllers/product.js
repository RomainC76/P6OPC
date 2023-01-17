//on importe le modèle de sauces
const Sauce = require('../models/Sauce');

const fs = require('fs');


//export de la fonction de création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
    // on enlève l'id du corps de la requête
    //delete req.body._id;
    //on parse
    const sauceObject = JSON.parse(req.body.sauce);
    // on crée une nouvelle instance de Sauce
    const sauce = new Sauce({
        ...sauceObject, likes:0, disLikes: 0, imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    });
    //sauvegarde de la nouvelle sauce
    sauce.save()
    .then(() => res.status(201).json({message : 'Votre recette de sauce a bien été enregistrée'}))
    .catch(error => res.status(400).json({error}));
  };

//export de la fonction de modification d'une sauce
exports.modifySauce = (req,res,next) => {
    Sauce.updateOne({_id:req.params.id, _id:req.body.id})
    .then(() => res.status(200).json({message : 'Votre sauce a bie nété modifiée'}))
    .catch(error => res.status(400).json({error}));
};

//export de la fonction de suppression d'une sauce
exports.deleteSauce = (req,res,next) => {
    Sauce.findOne({_id:req.params.id})
    .then(() => res.status(200).json({message : 'Votre sauce a bien été supprimée'}))
    .catch(error => res.status(400).json({error}));
  };

//export de la fonction de récupération d'une sauce spécifique
exports.findOneSauce = (req,res,next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};

//export de la fonction de récupération du tableau de toutes les sauces
exports.findAllSauces = (req, res, next) => {
    Sauce.find()
    //on retourne le tableau des sauces
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
   };
