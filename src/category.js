"use strict";
exports.__esModule = true;
var path = require("path");
var fs = require("fs");
var express = require("express");
var app = express(); //init express application
app.use(express.json());
var PORT = 5000;
var categories = JSON.parse(fs.readFileSync(path.join(__dirname, 'Categories.json'), 'utf-8'));
app.get('/api/categories', function (req, res) {
    res.send(categories);
});
app.get('/api/categories/:id', function (req, res) {
    var category = categories.find(function (c) { return c.id === req.params.id; });
    if (!category)
        return res.status(404).send('The Category with the given ID is not found');
    else
        res.send(category);
});
app.post('/api/categories', function (req, res) {
    if (typeof req.body.name !== 'string' || req.body.name === undefined) {
        return res.status(404).send('you must send name property as string');
    }
    for (var i = 0; i < categories.length; i++) {
        if (categories[i]['id'] == req.body.id)
            return res.status(404).send('you must send unique id');
    }
    for (var i = 0; i < categories.length; i++) {
        if (categories[i]['name'] == req.body.name)
            return res.status(404).send('you must send unique name');
    }
    var category = {
        id: req.body.id,
        name: req.body.name
    };
    categories.push(category);
    fs.writeFileSync(path.join(__dirname, 'Categories.json'), JSON.stringify(categories));
    res.send(category);
});
app.put('/api/categories/:id', function (req, res) {
    var category = categories.find(function (c) {
        return c.id === req.params.id;
    });
    if (!category)
        return res.status(404).send('The Category with the given ID is not found');
    else if (typeof req.body.name !== 'string' || req.body.name === undefined) {
        return res.status(404).send('you must send name property as string');
    }
    else {
        for (var i = 0; i < categories.length; i++) {
            if (categories[i]['name'] == req.body.name)
                return res.status(404).send('you must send unique name');
        }
        category.name = req.body.name;
        fs.writeFileSync(path.join(__dirname, 'Categories.json'), JSON.stringify(categories));
        res.send(category);
    }
});
app["delete"]('/api/categories/:id', function (req, res) {
    var category = categories.find(function (c) { return c.id === req.params.id; });
    if (!category)
        return res.status(404).send('The Category with the given ID is not found');
    else {
        var index = categories.indexOf(category);
        categories.splice(index, 1);
        fs.writeFileSync(path.join(__dirname, 'Categories.json'), JSON.stringify(categories));
        res.send(category);
    }
});
app.listen(PORT, function () { return console.log("Server Running on port: http://localhost:" + PORT); });
