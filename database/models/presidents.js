const { Schema } = require("mongoose");

const PresidentsSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  date: {
    type: String,
    required: true,
  },
});

module.exports = PresidentsSchema;