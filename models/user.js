//import de mongoose
const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator"); // Rend les champs uniques si demandé (email)

const userShema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userShema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model("User", userShema);