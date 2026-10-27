import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/notes");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
      <p><Link to="/forgot-password">Forgot password?</Link></p>
      {error && <p className="error">{error}</p>}
      <p>Don't have an account? <Link to="/signup">Signup</Link></p>
    </div>
  );
}

export default Login;