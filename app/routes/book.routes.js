const express = require("express");
const books = require("../controllers/book.controller");


module.exports = (app) => {
    const router = express.Router();

    router.route("/")
        .get(books.findAll)
        .post(books.create)
        .delete(books.deleteAll);

    router.route("/favorite")
        .get(books.findAllFavorite);

    router.route("/:id")
        .get(books.findOne)
        .put(books.update)
        .delete(books.delete)
        
    app.use("/api/books", router);
};