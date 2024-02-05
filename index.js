const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
require("dotenv").config();

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use("/public", express.static("public"));

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});

// app.use(cors({
//     origin: process.env.APP_URL,
//     methods: 'GET',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }));

// Allow only a single origin
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.APP_URL);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

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

const transactions = require("./routes/transactions");
app.use("/api", transactions);
