// const express = require('express');
// const jwt = require('jsonwebtoken');
// let books = require("./booksdb.js");
// const regd_users = express.Router();

// let users = [];

// const isValid = (username)=>{ //returns boolean
// //write code to check is the username is valid
// }

// const authenticatedUser = (username,password)=>{
//     let validusers = users.filter((user)=>{
//       return (user.username === username && user.password === password)
//     });
//     if(validusers.length > 0){
//       return true;
//     } else {
//       return false;
//     }
//   }

// //only registered users can login
// regd_users.post("/login", (req,res) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     if (!username || !password) {
//         return res.status(404).json({message: "Error logging in"});
//     }
//    if (authenticatedUser(username,password)) {
//       let accessToken = jwt.sign({
//         data: password
//       }, 'access', { expiresIn: 60 * 60 });
//       req.session.authorization = {
//         accessToken,username
//     }
//     return res.status(200).send("User successfully logged in");
//     } else {
//       return res.status(208).json({message: "Invalid Login. Check username and password"})
//     }
// });

// // Add a book review
// regd_users.put("/auth/review/:isbn", (req, res) => {
//     const isbn = req.params.isbn;
//     const review = req.query.review;
  
//     if (!review) {
//       return res.status(400).json({ message: "Review content is required" });
//     }
  
//     const { username } = req.session.authorization;
//     const book = books[isbn];
  
//     if (!book) {
//       return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
//     }
  
//     if (!book.reviews) {
//       book.reviews = {};
//     }
  
//     book.reviews[username] = review;
//     return res.status(200).json({ message: `Review for book with ISBN ${isbn} has been added/updated` });
//   });

// module.exports.authenticated = regd_users;
// module.exports.isValid = isValid;
// module.exports.users = users;
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 
  // Write code to check if the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  const { username } = req.session.authorization;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }

  if (!book.reviews) {
    book.reviews = {};
  }

  book.reviews[username] = review;
  return res.status(200).json({ message: `Review for book with ISBN ${isbn} has been added/updated` });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { username } = req.session.authorization;
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
  
    if (!book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: `Review by user ${username} not found for book with ISBN ${isbn}` });
    }
  
    delete book.reviews[username];
    return res.status(200).json({ message: `Review for book with ISBN ${isbn} by user ${username} has been deleted` });
  });

module.exports = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
