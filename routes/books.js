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
/*var upload = multer({
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
});*/

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === "coverPic") {
            // Handle validation for coverPic files
            if (
                file.mimetype == "image/png" ||
                file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg" ||
                file.mimetype == "text/plain"
            ) {
                cb(null, true);
            } else {
                cb(null, false);
                return cb(new Error("Only .png, .jpg, .jpeg, and .txt format allowed for coverPic!"));
            }
        } else if (file.fieldname === "bookpdf") {
            // Handle validation for bookpdf files
            if (
                file.mimetype == "application/pdf" ||
                file.mimetype == "text/plain"
            ) {
                cb(null, true);
            } else {
                cb(null, false);
                return cb(new Error("Only .pdf and .txt format allowed for bookpdf!"));
            }
        } else {
            cb(null, false);
            return cb(new Error("Invalid fieldname!"));
        }
    },
});

/*var uploadpdf = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "application/pdf" ||
            file.mimetype == "text/plain" // text/plain added to support requests from IOS devices
        ) {
            cb(null, true);
            console.log("File Type", file.mimetype);
        } else {
            console.log("File Type", file.mimetype);
            cb(null, false);
            return cb(new Error("Only .pdf format allowed!"));
        }
    },
});*/

const Model = require("../model/booksModel");

//POST request - multiple file upload
router.post("/books/", upload.fields([
    { name: 'coverPic', maxCount: 1 },
    { name: 'bookpdf', maxCount: 1 }
]), async (req, res) => {
    const url = req.protocol + "://" + req.get("host");

    const book = new Model({
        bookname: req.body.bookname,
        price: req.body.price,
        coverPic: url + "/public/" + req.files['coverPic'][0].filename,
        bookpdf: url + "/public/" + req.files['bookpdf'][0].filename,
    });

    console.log("DATA", book, req.files);
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



//Post Method - Books
/*router.post("/books/", upload.single("coverPic"), uploadpdf.single("bookpdf"), async (req, res) => {
    const url = req.protocol + "://" + req.get("host");
    const book = new Model({
        bookname: req.body.bookname,
        price: req.body.price,
        coverPic: url + "/public/" + req.file.filename,
        bookpdf: url + "/public/" + req.file.filename,
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
}); */

/*router.post("/books", async (req, res) => {
    const data = new Model({
        bookname: req.body.bookname,
        price: req.body.price,
        coverPic: req.body.coverPic
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
        //Trigger notification
        //All pushTokens to be retrieved from notifications model
        //Construct the notification message body
        //Invoke the notification

        //sendPushNotification();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});*/

//Get all Method - Books
router.get("/books", async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// PUT route to update download count by book ID
router.put("/books/:id/download", async (req, res) => {
    const bookId = req.params.id;

    try {
        // Find the book by ID
        const book = await Model.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Increment the download count
        book.downloadCount += 1;

        // Save the updated book
        const updatedBook = await book.save();

        res.json({
            message: "Download count updated successfully",
            book: updatedBook,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
