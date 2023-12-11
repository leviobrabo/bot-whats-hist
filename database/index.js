const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PresidentsSchema = require("./models/presidents");

dotenv.config();

mongoose.connect(process.env.DB_STRING);

const PresidentsModel = mongoose.model("Presidents", PresidentsSchema);

module.exports = { PresidentsModel };