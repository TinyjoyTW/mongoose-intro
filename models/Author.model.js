const mongoose = require("mongoose");

// CREATE SCHEMA
const AuthorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  bio: String,
});

// CREATE MODEL
const Author = mongoose.model("Author", AuthorSchema);

// EXPORT THE MODEL
module.exports = Author;
