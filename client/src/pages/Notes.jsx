import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Notes() {
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [search, setSearch] = useState("");

    const fetchNotes = async () => {
        try {
            const res = await API.get("/notes", { params: { search } });
            setNotes(res.data);
        } catch (err) {
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchNotes();
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            await API.post("/notes", { title, content });
            setTitle("");
            setContent("");
            fetchNotes();
        } catch (err) {
            console.log(err.response?.data?.message);
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this note?")) return;

        try {
            await API.delete(`/notes/${id}`);
            fetchNotes();
        } catch (err) {
            console.log(err.response?.data?.message);
        }
    };
    const startEdit = (note) => {
        setEditingId(note._id);
        setEditTitle(note.title);
        setEditContent(note.content);
    };

    const handleUpdate = async (id) => {
        try {
            await API.put(`/notes/${id}`, { title: editTitle, content: editContent });
            setEditingId(null);
            fetchNotes();
        } catch (err) {
            console.log(err.response?.data?.message);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="container">
            <div className="top-bar">
                <h2>My Notes</h2>
                <button className="btn-secondary" onClick={handleLogout}>Logout</button>
            </div>

            <form className="card form-card" onSubmit={handleAdd}>
                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button type="submit">Add Note</button>
            </form>

            <div className="form-card">
                <input
                    placeholder="Search notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {notes.length === 0 && <p className="empty">No notes found.</p>}

            <div className="notes-grid">
                {notes.map((note) => (
                    <div className="card note" key={note._id}>
                        {editingId === note._id ? (
                            <>
                                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                <input value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                                <div className="actions">
                                    <button onClick={() => handleUpdate(note._id)}>Save</button>
                                    <button className="btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3>{note.title}</h3>
                                <p className="date">{new Date(note.createdAt).toLocaleDateString()}</p>
                                <p>{note.content}</p>
                                <div className="actions">
                                    <button className="btn-secondary" onClick={() => startEdit(note)}>Edit</button>
                                    <button className="btn-danger" onClick={() => handleDelete(note._id)}>Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Notes;