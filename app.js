// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

// Root endpoint
app.get("/", (req, res, next) => {
    res.send("<p>Take home assignment from Ensemble (Backend)</p>")
});

// Insert here other API endpoints
app.get("/api/movies", (req, res, next) => {
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

app.get("/api/movie/:id", (req, res, next) => {
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

app.post("/api/movie/", (req, res, next) => {
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
})

app.put("/api/movie/:id", (req, res, next) => {
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
})

app.delete("/api/movie/:id", (req, res, next) => {
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
})


// Default response for any other request
app.use(function(req, res){
    res.status(404);
});