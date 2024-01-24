const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
    bookName: {
        required: true,
        type: String,
    },

    price: {
        required: true,
        type: String,
    },
});

module.exports = mongoose.model("Books", booksSchema);
