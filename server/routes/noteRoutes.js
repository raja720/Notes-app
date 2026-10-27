const express = require("express")
const protect = require("../middleware/authMiddleware")

const {createNote,getNotes,updateNote,deleteNote} = require("../controllers/noteControllers");

const router  = express.Router()
router.post("/",protect,createNote);
router.get("/",protect,getNotes)
router.put("/:id",protect,updateNote)
router.delete("/:id",protect,deleteNote)
module.exports = router;
