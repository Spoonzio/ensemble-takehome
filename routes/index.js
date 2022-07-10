const express = require("express");
const router = express.Router();

/**
 * Index route
 */
router.get("/", function (req, res, next) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;
