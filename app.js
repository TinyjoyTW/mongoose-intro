// app.js
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const Book = require("./models/Book.model");
const Author = require("./models/Author.model");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/mongoose-intro-dev")
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
// Allow our server to send and receive json data
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {
  console.log(req);
});

//  GET  /books - Retrieve all books from the database
app.get("/books", (req, res) => {
  Book.find({})
    .then((allBooks) => {
      console.log("Retrieved books ->", allBooks);
      res.status(200).send(allBooks);
    })
    .catch((error) => {
      console.error("Error while retrieving books ->", error);
      res.status(500).send({ error: "Failed to retrieve books" });
    });
});

//  GET  /authors - Retrieve all authors from the database
app.get("/authors", (req, res) => {
  Author.find({})
    .then((allAuthors) => {
      console.log("Retrieved author ->", allAuthors);
      res.status(200).send(allAuthors);
    })
    .catch((error) => {
      console.error("Error while retrieving authors ->", error);
      res.status(500).send({ error: "Failed to retrieve authors" });
    });
});

//  GET  /books/:id - Get a single book by its id, and populate the `author` field
app.get("/books/:id", (req, res) => {
  const bookId = req.params.id;

  Book.findById(bookId)
    .populate("author") // Replaces the author ObjectId with the full author document
    .then((book) => {
      console.log("Retrieved book with author details ->", book);
      res.status(200).send(book);
    })
    .catch((error) => {
      console.error("Error while retrieving book ->", error);
      res.status(500).send({ error: "Failed to retrieve book" });
    });
});


//  POST  /books - Creates a new book in the database
app.post("/books", (req, res) => {
  // req.body contains the data sent by the client.
  // This must match the structure defined in our Book schema.
  // Book.create(req.body)
  // // OR
  Book.create({
    title: req.body.title,
    year: req.body.year,
    codeISBN: req.body.codeISBN,
    quantity: req.body.quantity,
    genre: req.body.genre,
    author: req.body.author,
  })
    .then((createdBook) => {
      console.log("Book created ->", createdBook);
      res.status(201).send(createdBook);
    })
    .catch((error) => {
      console.error("Error while creating the book ->", error);
      res.status(500).send({ error: "Failed to create the book" });
    });
});

//  POST  /authors - Create a new author
app.post("/authors", (req, res) => {
	Author.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    bio: req.body.bio
  })
  .then((createdAuthor) => {
  	console.log("Author added ->", createdAuthor);
  
    res.status(201).send(createdAuthor);
  })
  .catch((error) => {
    console.error("Error while creating the author ->", error);
    res.status(500).send({ error: "Failed to create the author" });
  });
});

// PUT - Updates a book
app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;

  Book.findByIdAndUpdate(bookId, req.body, { new: true })
    .then((updatedBook) => {
      console.log("Updated book ->", updatedBook);
      res.status(204).send(updatedBook);
    })
    .catch((err) => {
      console.error("Error while updating the book ->", error);
      res.status(500).send({ error: "Failer to update the book" });
    });
});

//  DELETE  /books/:id - Delete a book by its id
app.delete("/books/:bookID", (req, res) => {
  Book.findByIdAndDelete(req.params.bookID)
    .then((foundBook) => {
      console.log("Book deleted!");
      res.status(204).send(); // Send back only status code 204 indicating that resource is deleted
    })
    .catch((error) => {
      console.error("Error while deleting the book ->", error);
      res.status(500).send({ error: "Deleting book failed" });
    });
});


app.listen(3000, () => console.log("App listening on port 3000!"));
