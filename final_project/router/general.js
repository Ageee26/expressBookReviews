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

// Get the book list available in the shop using promises and callbacks
public_users.get('/',function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(JSON.stringify(books,null,4))
        }, 2000)})

    myPromise.then((booksList) => {
        res.send(booksList)
    })
});

// Get book details based on ISBN using promises and callbacks
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books)
        }, 2000)})

    myPromise.then((booksList) => {
        res.send(booksList[isbn])
    })
 });
  
// Get book details based on author using promises and callbacks
public_users.get('/author/:author',function (req, res) {
    const req_author = req.params.author;
    let filtered_books = [];
    for (const key of Object.keys(books)) {
        if (books[key].author === req_author){
            filtered_books.push(books[key]);
        }
    }
    let myPromise = new Promise((resolve,reject)=>{
        if (filtered_books.length > 0) {
            resolve(JSON.stringify(filtered_books));
        }
        else {
            resolve('No books with the author \''+req_author+'\' was found')
        }  
    })
    myPromise.then((msg) => {
        res.send(msg)
    })
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
    let myPromise = new Promise((resolve,reject)=>{
        if (filtered_books.length > 0) {
            resolve(JSON.stringify(filtered_books));
        }
        else {
            resolve('No books with the title \''+req_title+'\' was found')
        }  
    })
    myPromise.then((msg) => {
        res.send(msg)
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
