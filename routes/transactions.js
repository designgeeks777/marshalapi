const express = require("express");
const multer = require("multer");

const router = express.Router();



//module.exports = router;

// router.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", process.env.APP_URL);
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//     next();
// });



const Model = require("../model/transactionsModel");





router.post("/transactions", async (req, res) => {
    const data = new Model({
        transactionid: req.body.transactionid,
        dateoftransaction: req.body.dateoftransaction,
        amount: req.body.amount,
        status: req.body.status,
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Get all Method - Books
router.get("/transactions", async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
