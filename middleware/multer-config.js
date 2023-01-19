const multer = require("multer"); // Gère les fichiers

const fs = require("fs"); // Accède aux fichiers afin de les modifier
const path = require("path"); // Manipule les chemins de fichier

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const imagePath = path.resolve(__dirname, "..", "images"); // Chemin du dossier images

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Crée le dossier images si celui-ci est inexistant
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath);
      console.log("Fichier créé :", imagePath);
    }
    // Accède au dossier images
    callback(null, "images");
  },
  // Uniformise et définit le nom du fichier
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_").split(".")[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// Exporte l'instance de multer et indique l'envoi d'un fichier unique dans le formulaire
module.exports = multer({ storage }).single("image");