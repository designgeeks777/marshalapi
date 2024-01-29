const mongoose = require("mongoose");

const transactionsSchema = new mongoose.Schema({
    transactionid: {
        required: true,
        type: String,
    },

    dateoftransaction: {
        required: true,
        type: String,
    },
    amount: {
        type: String,
        default: "",
        required: true,
    },
    status: {
        type: String,
        default: 0,
        required: true,
    }
});

module.exports = mongoose.model("Transactions", transactionsSchema);
