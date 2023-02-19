//jshint esversion:6

const express = require("express");

const app = express();

app.set('view engine', 'ejs');

app.get("/", function (req, res) {
var today = new Date();
var currentDay = today.getDay();

if (currentDay === 6 || currentDay === 0) {
    res.sendFile(__dirname + "/index.html");
} else {
    res.send("Boo! I have to work!");
}
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});