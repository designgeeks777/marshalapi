const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
    orderid: {
        required: true,
        type: String,
    },

    dateoforder: {
        required: true,
        type: String,
    },

    amount: {
        type: String,
        required: true,
    },
    books: {
        type: Array,
        default: [],
    },
    orderedby: {
        type: String,
        required: true,
    },
    emailid: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    paymentscreenshot: {
        type: String,
        default: "",
    },
});

module.exports = mongoose.model("Orders", ordersSchema);
