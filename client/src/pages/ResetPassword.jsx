import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    try {
      const res = await API.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-card">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button type="submit">Reset password</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <p><Link to="/login">Back to login</Link></p>
    </div>
  );
}

export default ResetPassword;