const Note = require("../models/Note");
const createNote = async(req,res)=>{
    try{
        const {title,content} = req.body;
        if(!title){
            return res.status(400).json({message:"Title is required"})
        }

        const note = await Note.create({
            title,
            content,
            user: req.userId
        });
        res.status(201).json(note);


    }catch (error){
        res.status(500).json({message:"server error", error:error.message});
    }
}


const getNotes = async (req, res) => {
  try {
    const { search } = req.query;

    const filter = { user: req.userId };

    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { content: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, content },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = {createNote,getNotes,updateNote,deleteNote}