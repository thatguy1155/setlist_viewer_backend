const express = require("express");
const router = express.Router();
const setlistController = require("../controller/setlistController");
router.get("/:artistName/:song", setlistController.getSetlist);
module.exports = router;