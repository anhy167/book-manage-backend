const mongoose = require("mongoose");
const { BadRequestError } = require("../errors");
const handlePromise = require("../helpers/promise.helper");
const Book = require("../models/book.model");



exports.create = async (req, res, next) => {
    if (!req.body.name) {
        return next(new BadRequestError(400, "Name can not be empty"));
    }

    const book = new Book({
        name: req.body.name,
        author: req.body.author,
        cate: req.body.cate,
        publishCom: req.body.publishCom,
        republish: req.body.republish,
        favorite: req.body.favorite === true,
    });

    const [error, document] = await handlePromise(book.save());

    if (error) {
        return next(new BadRequestError(500,
            "An error occurred while creating the book"));
    }

    return res.send(document);
};

exports.findAll = async (req, res, next) => {
    const condition = { };
    const { name } = req.query;
    if (name) {
        condition.name = { $regex: new RegExp(name), $options: "i"};
    }

    const [error, documents] = await handlePromise(Book.find(condition));

    if (error) {
        return next(new BadRequestError(500,
            "An error occurred while retrieving books"));
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    const [error, document] = await handlePromise(Book.findOne(condition));


    if (error) {
        return next(new BadRequestError(500,
            `Error retrieving book with id=${req.params.id}`));
    }

    if (!document) {
        return next(new BadRequestError(404,
            "Book not found"));
    }

    return res.send(document);
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new BadRequestError(400,
            "Data to update can not be empty"));
    }

    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    const [error, document] = await handlePromise(
        Book.findOneAndUpdate(condition, req.body, {
            new: true,
        })
    );

    if (error) {
        return next(new BadRequestError(500,
            `Error updating book with id=${req.params.id}`));
    }

    if (!document) {
        return next(new BadRequestError(404, "Book not found"));
    }

    return res.send({ message: "Book was updated successfully"});
    
}

exports.delete = async (req, res, next) => {
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    const [error, document] = await handlePromise(
        Book.findOneAndDelete(condition)
    );

    if (error) {
        return next(new BadRequestError(500,
            `Could not delete book with id=${req.params.id}`));
    }

    if (!document) {
        return next(new BadRequestError(404, "Book not found"));
    }

    return res.send({ message: "Book was deleted successfully"});
    
}

exports.findAllFavorite = async (req, res, next) => {
    const [error, documents] = await handlePromise(
        Book.find({ favorite: true, })
    );

    if (error) {
        return next(new BadRequestError(500,
            "An error occurred while retrieving favorite books"));
    }

    return res.send(documents);
    
};

exports.deleteAll = async (req, res, next) => {
    const [error, data] = await handlePromise(
        Book.deleteMany({ })
    );

    if (error) {
        return next(new BadRequestError(500,
            "An error occurred while removing all books"));
    }

    return res.send({
        message: `${data.deleteCount} books were deleted successfully`,
    });
    
};


