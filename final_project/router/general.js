const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
function getBookByIsbn(isbn) {
    return new Promise((resolve, reject) => {
        let book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject('Book not found');
        }
    });
  }
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
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
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  getBookByIsbn(isbn)
    .then( book =>{
      return res.status(200).json(book);
    })
    .catch(err => {
      return res.status(300).json({ message: err });
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let filteredBooks = {};
  for (let key in books) {
    if (books[key].author === req.params.author) {
        filteredBooks[key] = books[key];
    }
  }
  return res.status(200).json({booksbyauthor: filteredBooks});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let filteredBooks = {};
  for (let key in books) {
    if (books[key].title === req.params.title) {
        filteredBooks[key] = books[key];
    }
  }
  return res.status(200).json({booksbytitle: filteredBooks});});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const review = books[req.params.isbn].reviews;
  return res.status(300).json({review: review});
});

module.exports.general = public_users;
