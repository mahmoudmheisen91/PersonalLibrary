"use strict";

let expect = require("chai").expect;
let mongo = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectID;
let MongoClient = require("mongodb").MongoClient;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app, db) {
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      db.collection("Library")
        .find()
        .toArray(function (err, books) {
          if (err) {
            res.redirect("/");
          } else {
            books.map((item) => {
              item.commentcount = item.comments.length;
              delete item.comments;
            });
            res.json(books);
          }
        });
    })

    .post(function (req, res) {
      let title = req.body.title;
      let book = {
        title,
        comments: [],
      };
      let error = "Missing Data";
      if (!title) {
        res.status(404).type("text").send(error);
        res.end();
      } else {
        db.collection("Library").insertOne(book, (err, doc) => {
          if (err) {
            res.redirect("/");
          } else {
            book._id = doc.insertedId;
            res.json(book);
            res.end();
          }
        });
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      let error = "Missing Data";
      if (!bookid) {
        res.status(404).type("text").send(error);
        res.end();
      } else {
        let book = { _id: new ObjectId(bookid) };
        db.collection("Library")
          .find(book)
          .toArray((err, doc) => {
            if (err) {
              res.redirect("/");
            } else {
              res.json(doc);
              res.end();
            }
          });
      }
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      let error = "Missing Data";
      if (!bookid || !comment) {
        res.status(404).type("text").send(error);
        res.end();
      } else {
        let book = { _id: new ObjectId(bookid) };
        db.collection("Library").findAndModify(
          book,
          {},
          { $push: { comments: comment } },
          { new: true, upsert: false },
          (err, doc) => {
            if (err) {
              res
                .status(400)
                .type("text")
                .send("could not update " + bookid);
              res.end();
            } else {
              res.json(doc.value);
              res.end();
            }
          }
        );
      }
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
