// Create express app
var express = require("express")
var app = express()

const path = require("path");

const indexRouter = require("./routes/index");
const movieRouter = require("./routes/movie");

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Allow CORS
app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Define Routers
app.use("/", indexRouter);
app.use("/api/movies", movieRouter);

module.exports = app;