const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
    bookname: {
        required: true,
        type: String,
    },

    price: {
        required: true,
        type: String,
    },
    coverPic: {
        type: String,
        default: "",
    },
    bookpdf: {
        type: String,
        default: "",
    },
    downloadCount: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model("Books", booksSchema);
