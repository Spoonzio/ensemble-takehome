const express = require("express");
const router = express.Router();
var db = require("../database.js")

/**
 * Get All movies
 */
router.get("/", function (req, res, next) {
    var sql = "select * from movie"
    var params = []
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
    var sql = "select * from movie where id = ?"
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

module.exports = router;