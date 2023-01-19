const bcrypt = require("bcrypt"); // Hasher les mdp
const jwt = require("jsonwebtoken"); // Gestion des tokens
const cryptojs = require("crypto-js"); // crypte les emails
const dotenv = require("dotenv").config(); // Gère les variables d'environnement (planque les données sensibles)
const User = require("../models/User"); // Modèle User

// logique de connexion
exports.signup = (req, res, next) => {
    // crypte le mail
    const emailCryptoJs = cryptojs
        .HmacSHA256(req.body.email, `${process.env.CRYPTOJSMAIL}`)
        .toString();

    // hash le mdp
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: emailCryptoJs,
                password: hash,
            });
            //enregistre le nouvel utilisateur dans la bd
            user.save()
                .then(() =>
                    res.status(201).json({ message: "Utilisateur créé" })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    //crypte le mail
    const emailCryptoJs = cryptojs
        .HmacSHA256(req.body.email, `${process.env.CRYPTOJSMAIL}`)
        .toString();

    // cherche le mail crypté
    User.findOne({ email: emailCryptoJs })
        .then((user) => {
            if (!user) {
                res.status(401).json({
                    message: "Paire identifiant/mot de passe incorrecte",
                });
                // compare les données avec celles de la bd
            } else {
                // Authentifie l'utilisateur
                bcrypt
                    .compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid) {
                            res.status(401).json({
                                message:
                                    "Paire identifiant/mot de passe incorrecte",
                            });
                        } else {
                            // Lui attribue un token de connexion
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    `${process.env.TOKEN}`,
                                    { expiresIn: "24h" }
                                ),
                            });
                        }
                    })
                    .catch((error) => res.status(500).json({ error }));
            }
        })
        .catch((error) => res.status(500).json({ error }));
};