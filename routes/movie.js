const express = require("express");
const router = express.Router();
var db = require("../database.js");
const { move } = require("./index.js");

/**
 * Get All movies
 * and search for a movie if given a search term (?name)
 */
router.get("/", function (req, res, next) {
    var sql = "SELECT * FROM movie"
    var params = []

    let searchTerm = req.query.name;
    if(searchTerm){
        sql = "SELECT * FROM movie WHERE title LIKE ?"
        params = ['%' + searchTerm + '%']
    }
    
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

/**
 * Get a movie by ID
 */
router.get("/:id", function (req, res, next) {
    var sql = "SELECT * FROM movie WHERE id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

/**
 * Create new movie
 */
router.post("/", function (req, res, next) {
    var errors=[]
    if (!req.body.title){
        errors.push("No title specified");
    }
    if (!req.body.year){
        errors.push("No year specified");
    }
    if (!req.body.duration){
        errors.push("No duration specified");
    }
    if (!req.body.rating){
        errors.push("No rating specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    var data = {
        title: req.body.title,
        description: req.body.description,
        year: req.body.year,
        duration: req.body.duration,
        rating : req.body.rating,
    }

    var sql = 'INSERT INTO movie (title, description, year, duration, rating) VALUES (?,?,?,?,?)'
    var params =[data.title, data.description, data.year, data.duration, data.rating]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
});

/**
 * Update movie
 */
router.put("/:id", function (req, res, next) {
    var data = {
        title: req.body.title,
        description: req.body.description,
        year: req.body.year,
        duration: req.body.duration,
        rating : req.body.rating,
    }
    db.run(
        'UPDATE movie SET title = ?, description = ?, year = ? , duration = ?, rating = ? WHERE id = ?',
        [data.title, data.description, data.year, data.duration, data.rating, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
});

/**
 * Delete movie
 */
router.delete("/:id", function (req, res, next) {
    db.run(
        'DELETE FROM movie WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
});

/**
 * Dislike / Like a Movie
 */
 router.post("/:id/:action(like|dislike)", function (req, res, next) {

    // Prepare the query
    var sql;
    if(req.params.action == "like"){
        sql = "UPDATE movie SET vote = vote + 1 WHERE id = ?"
    }else if(req.params.action == "dislike"){
        sql = "UPDATE movie SET vote = vote - 1 WHERE id = ?"
    }else{
        res.status(400).json({"error": "Invalid action"})
        return;
    }

    var params = [req.params.id]

    db.run(
        sql, 
        params, 
        (err, result)=> {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                changes: this.changes
            })
    });
});

module.exports = router;