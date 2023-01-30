const express = require("express"); // Utilisation d'Express

const dotenv = require("dotenv").config(); // Gère les variables d'environnement (planque les données sensibles)
const path = require("path"); // Manipule les chemins de fichier

const helmet = require("helmet"); // Sécurité : Configure les headers de réponse
const cors = require("cors"); // Sécurité : gère les accès serveur depuis des origines
const morgan = require("morgan"); // Log les requêtes HTTP du serveur
const mongooseExpressErrorHandler = require("mongoose-express-error-handler"); // Remonte les erreurs Mongoose et les gère de manière centralisée

const mongoose = require("mongoose"); // Utilisation de Mongoose

const userRoutes = require("./routes/user"); // Chemin user
const sauceRoutes = require("./routes/sauce"); // Chemin sauce

const app = express(); // Lance Express sur Node.

const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

//  Configure l'app à la base de données Mongoose
mongoose.set("strictQuery", true);
mongoose
  .connect(`${process.env.MONGODBSRV}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json()); // Permet de gérer les données requête envoyées sous forme de JSON : parse les données et les ajoute à l'objet req.body

// Définit les entêtes de manière basique : inutile si Helmet est configuré
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
//     );
//     res.setHeader(
//         "Access-Control-Allow-Methods",
//         "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//     );
//     next();
// });

// Ecoute les évenements de la BD et remonte les erreurs
const db = mongoose.connection;
db.on("error", (error) => console.error(error));

// Définit les CORS sur une requête provenant du même site
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

// Lance MongooseExpressErrorHandler
app.use(mongooseExpressErrorHandler);

// Définit l'utilisation de morgan avec un format de journalisation de manière détaillée
app.use(morgan("dev"));

// Utilise CORS fourni par Express
app.use(cors());

// Définit le chemin images
app.use("/images", express.static(path.join(__dirname, "images")));

// Impose l'authentification sur la route utilisateur en indiquant à l'app la route à suivre pour les requêtes /api/auth
app.use("/api/auth", userRoutes);

// Indique à l'app la route à suivre pour les requêtes /api/sauces
app.use("/api/sauces", sauceRoutes); //

module.exports = app;