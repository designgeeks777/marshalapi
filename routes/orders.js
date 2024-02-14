const express = require("express");
const multer = require("multer");

const router = express.Router();

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


const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === "paymentscreenshot") {
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
                return cb(
                    new Error(
                        "Only .png, .jpg, .jpeg, and .txt format allowed for coverPic!"
                    )
                );
            }
        } else {
            cb(null, false);
            return cb(new Error("Invalid fieldname!"));
        }
    },
});



const Model = require("../model/ordersModel");



router.post(
    "/orders/",
    upload.fields([
        { name: "paymentscreenshot", maxCount: 1 },
    ]),
    async (req, res) => {
        const url = req.protocol + "://" + req.get("host");

        const data = new Model({
            orderid: req.body.orderid,
            dateoforder: req.body.dateoforder,
            amount: req.body.amount,
            books: req.body.books,
            orderedby: req.body.orderedby,
            emailid: req.body.emailid,
            phone: req.body.phone,
            paymentscreenshot: url + "/public/" + req.files["paymentscreenshot"][0].filename,
        });
        console.log("DATA", data, req.files);
        data
            .save()
            .then((result) => {
                res.status(201).json({
                    message: "Ordered created succesfully!",
                    Created: {
                        _id: result._id,
                        orderid: result.orderid,
                        dateoforder: result.dateoforder,
                        amount: result.amount,
                        books: result.books,
                        orderedby: result.orderedby,
                        emailid: result.emailid,
                        phone: result.phone,
                    },
                });
            })
            .catch((err) => {
                console.log(err),
                    res.status(500).json({
                        error: err,
                    });
            });
    }
);


/*router.post("/orders", async (req, res) => {
    const data = new Model({
        orderid: req.body.orderid,
        dateoforder: req.body.dateoforder,
        amount: req.body.amount,
        books: req.body.books,
        orderedby: req.body.orderedby,
        emailid: req.body.emailid,
        phone: req.body.phone,
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});*/

//Get all Method - Orders
router.get("/orders", async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
