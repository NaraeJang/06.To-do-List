//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// const items = [];
// const workItems = [];

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB', {
    useNewUrlParser: true
});

//Schema Setup
const ItemsSchema = new mongoose.Schema({
    name: String
});

const listsSchema = new mongoose.Schema({
    name: String,
    items: [ItemsSchema]
});

const Item = new mongoose.model('Item', ItemsSchema);

const List = new mongoose.model('List', listsSchema);

//Put Items in the DB
const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];





app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.get("/", function (req, res) {

    Item.find().then(foundItems => {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems).then(result => {
                console.log(result);
            }).catch(err => {
                console.log(err);
            });
            res.redirect("/");
        } else {
            res.render("list", {
                listTitle: "Today",
                newListItems: foundItems
            })
        };

    }).catch(err => {
        console.log(err);
    });

});

app.post("/", function (req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({
            name: listName
        }).then(foundList => {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        }).catch(err => {
            console.log(" error save new item in custom list");
        });

    };



    console.log(this);



});

app.post("/delete", function (req, res) {
    const checkItemId = req.body.checkBox;

    Item.findByIdAndRemove(checkItemId).then(result => {
        console.log("Successfully deleted an item.");
    }).catch(err => {
        console.log(err);
    });

    res.redirect("/");
});

// app.get("/work", function (req, res) {
//     res.render("list", {
//         listTitle: "Work List",
//         newListItems: workItems
//     });
// });

app.get("/:taskType", function (req, res) {
    const taskType = req.params.taskType;

    List.findOne({
        name: taskType
    }).then(function (foundList) {
        if (!foundList) {
            const list = new List({
                name: taskType,
                items: defaultItems
            });

            list.save();
            res.redirect("/" + taskType);

        } else {
            res.render("list", {
                listTitle: foundList.name,
                newListItems: foundList.items
            });
        }

    }).catch(err => {
        console.log(err);
    });





});


app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});