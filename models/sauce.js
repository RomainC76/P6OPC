//imort de mongoose
const mongoose = require("mongoose"); // Appelle Mongoose
const mongooseUniqueValidator = require("mongoose-unique-validator"); // Rend les champs uniques si demandé

const sauceShema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
});

sauceShema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model("Sauce", sauceShema);