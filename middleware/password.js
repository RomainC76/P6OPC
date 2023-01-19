const passwordValidator = require("password-validator"); // password Validator permet de créer un modèle de mdp

const schema = new passwordValidator();

schema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(2) // Must have at least 2 digits
    .has()
    .not()
    .spaces() // Should not have spaces
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123"]); // Blacklist these values

// Autorise la validité du mdp si celui ci correspond au modèle
module.exports = (req, res, next) => {
    if (schema.validate(req.body.password)) {
        next();
    } else {
        res.status(400).json({
            error:
                "Mot de passe trop faible :" +
                JSON.stringify(
                    schema.validate(`${req.body.password}`, { details: true })
                ),
        });
    }
};