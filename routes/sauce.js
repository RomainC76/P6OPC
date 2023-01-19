const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth"); // Permet l'utilisation du middlware d'authentification
const multer = require("../middleware/multer-config"); // Permet l'utilisation de multer

const sauceCtrl = require("../controllers/sauce");

router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.get("/", auth, sauceCtrl.getAllSauces);
router.post("/:id/like", auth, sauceCtrl.like);

module.exports = router;