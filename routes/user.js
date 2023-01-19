const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const password = require("../middleware/password"); // Permet l'utilisation du modèle de mdp

router.post("/signup", password, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;