const express = require("express");

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

const Model = require("../model/booksModel");



//Post Method - Books
router.post("/books/", async (req, res) => {
    const data = new Model({
        bookName: req.body.bookName,
        price: req.body.price,
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
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
