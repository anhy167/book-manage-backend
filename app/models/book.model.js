const mongoose = require("mongoose");


const schema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Book name is required"],
        },
        author: {
            type: String,
        },
        cate: {
            type: String,
        },
        publishCome: {
            type: String,
        },
        republish: {
            type: String,
        },
        favorite: {
            type: Boolean,
        },
    },
    { timestamps: true}
);

schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = mongoose.model("book", schema);