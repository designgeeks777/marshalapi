const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use("/public", express.static("public"));

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`);
});

require("dotenv").config();

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
    console.log(error);
});

database.once("connected", () => {
    console.log("Database Connected");
});

/*const payment = require("./routes/payment");
app.use("/api", payment);*/

const books = require("./routes/books");
app.use("/api", books);

/*const transactions = require("./require/transactions");
app.use("/api", transactions);*/





