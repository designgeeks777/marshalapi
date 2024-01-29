const express = require("express");
const multer = require("multer");

const router = express.Router();



//module.exports = router;

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.APP_URL);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

const DIR = "./public/";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(" ").join("-");
        cb(null, fileName);
    },
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "text/plain" // text/plain added to support requests from IOS devices
        ) {
            cb(null, true);
            console.log("File Type", file.mimetype);
        } else {
            console.log("File Type", file.mimetype);
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
});

const Model = require("../model/booksModel");



//Post Method - Books
router.post("/books/", upload.single("coverPic"), async (req, res) => {
    const url = req.protocol + "://" + req.get("host");
    const book = new Model({
        bookname: req.body.bookname,
        price: req.body.price,
        coverPic: url + "/public/" + req.file.filename,
    });
    console.log("DATA", book, req.file);
    book
        .save()
        .then((result) => {
            res.status(201).json({
                message: "Book registered successfully!",
                bookCreated: {
                    _id: result._id,
                    bookname: result.bookname,
                    price: result.price,
                    coverPic: result.coverPic,
                },
            });
        })
        .catch((err) => {
            console.log(err),
                res.status(500).json({
                    error: err,
                });
        });
});

//Get all Method - Books
router.get("/books", async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get by ID Method - Stories
/*router.get("/churchprayers/:id", async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});*/

//Update by ID Method - Stories
/*router.patch("/churchprayers/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(id, updatedData, options);

        res.send(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});*/

//Delete by ID Method - Stories
/*router.delete("/churchprayers/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id);
        res.send(`Document with ${data.name} has been deleted..`);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});*/

module.exports = router;
