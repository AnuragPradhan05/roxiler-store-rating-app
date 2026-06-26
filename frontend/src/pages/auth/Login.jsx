import { useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaSignInAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      login(res.data.token, res.data.role);

      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: "Login Successful",
        timer: 1200,
        showConfirmButton: false,
      });

      if (res.data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (res.data.role === "OWNER") {
        navigate("/owner/dashboard");
      } else {
        navigate("/stores");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.message || "Invalid Credentials",
      });
    }
  };

  return (
    <div className="login-container">

      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>

      <form className="login-form" onSubmit={handleSubmit}>

        <div className="login-header">
          <FaSignInAlt size={40} />
          <h2>Welcome Back</h2>
          <p>Login to continue</p>
        </div>

        {/* EMAIL */}
        <div className="input-group">
          <FaEnvelope />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        {/* PASSWORD */}
        <div className="input-group password-group">
          <FaLock />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>

        <p className="register-text">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

      </form>
    </div>
  );
}

export default Login;