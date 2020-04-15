let chaiHttp = require("chai-http");
let chai = require("chai");
let assert = chai.assert;
let server = require("../server");

chai.use(chaiHttp);

let _id;
suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function (done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        _id = res.body[0]._id;
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "book1" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.title, "book1");
              assert.property(
                res.body,
                "comments",
                "Book should contain comments"
              );
              assert.property(
                res.body,
                "title",
                "Book in array should contain title"
              );
              assert.property(
                res.body,
                "_id",
                "Book in array should contain _id"
              );
              assert.isArray(res.body.comments, "Comments should be an array");
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .end(function (err, res) {
              assert.equal(res.status, 404);
              assert.equal(res.text, "Missing Data");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body[0],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[0],
              "_id",
              "Books in array should contain _id"
            );
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/123456123456")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get("/api/books/" + _id)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body[0], "_id", "A Book should contain id");
            assert.equal(res.body[0]._id, _id);
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .post("/api/books/" + _id)
            .send({ comment: "test" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.include(
                res.body.comments,
                "test",
                "Comments should include test comment"
              );
              assert.property(res.body, "_id", "A Book should contain id");
              done();
            });
        });
      }
    );
  });
});
