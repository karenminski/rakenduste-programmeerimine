const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;
const DB = require("./server/database.js");

/**
 * GET all items
 */
app.get("/items",(req, res)=>{
    res.json(DB.getItems());
});

/**
 * GET item by id
 */
app.get("/items/:itemId",(req, res)=>{
    res.send(DB.getItem(req.params.itemId));
});

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.use(express.static("dist"));

// Heroku needs process.env.PORT
app.listen(PORT, () => {
    console.log("Server started");
    console.log(`http://localhost:${PORT}`);
});