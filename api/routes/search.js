const express = require("express");
const router = express.Router();
const searchController = require("../controller/searchController");
router.get("/:artistName/:song", searchController.getSongs);
module.exports = router;