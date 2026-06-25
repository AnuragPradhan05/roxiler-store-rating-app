import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../../api/axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      await API.post("/auth/register", formData);

      Swal.fire({
        title: "Account Created 🎉",
        text: "Your registration was successful",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      Swal.fire({
        title: "Oops 😕",
        text:
          error.response?.data?.message ||
          "Registration failed. Try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">

      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>

      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />

        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value })
          }
        >
          <option value="USER">USER</option>
          <option value="OWNER">OWNER</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;