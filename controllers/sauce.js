// Accès au modèle Sauce
const Sauce = require("../models/Sauce");

// fs pour File System, module permettant d'intéragir avec les fichiers
const fs = require("fs");

// sauce creation by user with Sauce model then others specifieds parameters
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); // Accède aux données du formulaire de création Sauce
    console.log(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    // Crée une nouvelle sauce avec les données formulaire + likes/dislikes
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
            }`,
        likes: 0,
        dislikes: 0,
    });
    // Sauvegarde la sauce
    sauce
        .save()
        .then(() => {
            res.status(201).json({ message: "Sauce enregistrée !" });
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// Sauce modification
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
        : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Non-autorisé" });
            } else {
                if (req.file) {
                    // Supprime l'ancienne image
                    fs.unlink(`images/${sauce.imageUrl.split("/images/")[1]}`, (error) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log(`Ancienne image supprimée.`);
                        }
                    });
                }
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce modifiée" }))
                    .catch((error) => res.status(400).json({ error }));
            }
        })
        .catch((error) => res.status(400).json({ error }));
};
// Sauce removal (if the user is authorized)
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // Atteint la sauce
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                //Empeche la suppression si non autorisé
                res.status(401).json({ message: "Not authorized" });
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({
                                message: "Sauce supprimée !",
                            });
                        })
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

// Getting a sauce by sauce id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(400).json({ error }));
};

// Getting all sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

exports.like = (req, res, next) => {
    Sauce.findById(req.params.id) // Atteint la sauce
        .then((sauce) => {
            // Met en place les 3 cas de like
            switch (req.body.like) {
                case 0: // Quand une sauce likée ou disilikée change d'état pour revenir à zero
                    Sauce.findOne({ _id: req.params.id })
                        .then((sauce) => {
                            if (sauce.usersLiked.includes(req.auth.userId)) {
                                // Si la sauce est likée, enleve un like et retire l'UserId du tableau des likes
                                Sauce.updateOne(
                                    { _id: req.params.id },
                                    {
                                        $inc: { likes: -1 },
                                        $pull: { usersLiked: req.auth.userId },
                                    }
                                )
                                    .then(() =>
                                        res.status(200).json({
                                            message:
                                                "Vous ne likez plus cette sauce !",
                                        })
                                    )
                                    .catch((error) =>
                                        res.status(400).json({ error })
                                    );
                            } else if (
                                // Si la sauce est dislikée, enleve un dislike et retire l'UserId du tableau des dislikes
                                sauce.usersDisliked.includes(req.auth.userId)
                            ) {
                                Sauce.updateOne(
                                    { _id: req.params.id },
                                    {
                                        $inc: { dislikes: -1 },
                                        $pull: {
                                            usersDisliked: req.auth.userId,
                                        },
                                    }
                                )
                                    .then(() =>
                                        res.status(200).json({
                                            message:
                                                "Vous ne dislikez plus cette sauce !",
                                        })
                                    )
                                    .catch((error) =>
                                        res.status(400).json({ error })
                                    );
                            }
                        })
                        .catch((error) => res.status(400).json({ error }));
                    break;
                case 1: // Set 1 au like et ajoute l'UserId au tableau des likes
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { likes: 1 },
                            $push: { usersLiked: req.auth.userId },
                        }
                    )
                        .then(() => {
                            res.status(200).json({
                                message: "Sauce likée !",
                            });
                        })
                        .catch((error) => res.status(400).json({ error }));
                    break;
                case -1:
                    // Set 1 au dislike et ajoute l'UserId au tableau des dislikes
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { dislikes: 1 },
                            $push: { usersDisliked: req.auth.userId },
                        }
                    )
                        .then(() => {
                            res.status(200).json({
                                message: "Sauce likée !",
                            });
                        })
                        .catch((error) => res.status(400).json({ error }));
                    break;
            }
        })
        .catch((error) => res.status(400).json({ error }));
};
