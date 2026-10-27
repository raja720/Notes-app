import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import API from "../api/api";

const Signup = () => {

    const [form, setform] = useState({ name: "", email: "", password: "" });
    const [error, seterror] = useState("")
    const navigate = useNavigate();

    const handleChange = (e)=>{
        setform({...form,[e.target.name]:e.target.value})
    };

    const handlesubmit = async (e)=>{
        e.preventDefault();
        seterror("")
        try{
            await API.post("/auth/signup",form)
            navigate("/login")
        }catch(err){
            seterror(err.response?.data?.message ||"Something went wrong");
        }

    }

    return (
        <div className="auth-card">

            <h2>Signup</h2>

            <form onSubmit={handlesubmit}>
                <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
                <button type="submit">Signup</button>
            </form>

           {error && <p className="error">{error}</p>}
            <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>

    )
}

export default Signup;