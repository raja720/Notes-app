import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await API.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-card">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send reset link</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <p><Link to="/login">Back to login</Link></p>
    </div>
  );
}

export default ForgotPassword;