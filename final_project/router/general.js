const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const req_author = req.params.author;
    let filtered_books = [];
    for (const key of Object.keys(books)) {
        if (books[key].author === req_author){
            filtered_books.push(books[key]);
        }
    }
    if (filtered_books.length > 0) {
        res.send(filtered_books);
    }
    else {
        res.send('No books with the author \''+req_author+'\' was found')
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const req_title = req.params.title;
    let filtered_books = [];
    for (const key of Object.keys(books)) {
        if (books[key].title === req_title){
            filtered_books.push(books[key]);
        }
    }
    if (filtered_books.length > 0) {
        res.send(filtered_books);
    }
    else {
        res.send('No books with the title \''+req_title+'\' was found')
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
