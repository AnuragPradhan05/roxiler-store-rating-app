import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import "./Dashboard.css";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import {
  FaUsers,
  FaStore,
  FaStar,
  FaPlus,
  FaUserShield,
} from "react-icons/fa";

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setStats(res.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Unable to load dashboard",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      await API.post("/admin/users", formData);

      Swal.fire({
        icon: "success",
        title: "User Created",
        timer: 1200,
        showConfirmButton: false,
      });

      setShowModal(false);

      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER",
      });

      fetchDashboard();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to create user",
      });
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        Loading dashboard...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="dashboard-container">

        {/* HEADER */}

        <div className="dashboard-header">

          <div>
            <h1 className="dashboard-title">
              <FaUserShield />
              Admin Dashboard
            </h1>

            <p className="dashboard-subtitle">
              Manage users, stores and ratings
            </p>
          </div>

          <button
            className="add-user-btn"
            onClick={() => setShowModal(true)}
          >
            <FaPlus />
            Add User
          </button>

        </div>

        {/* STATS CARDS */}

        <div className="cards">

          <div className="card">

            <div className="card-icon users">
              <FaUsers />
            </div>

            <h2>{stats.totalUsers}</h2>

            <p>Total Users</p>

          </div>

          <div className="card">

            <div className="card-icon stores">
              <FaStore />
            </div>

            <h2>{stats.totalStores}</h2>

            <p>Total Stores</p>

          </div>

          <div className="card">

            <div className="card-icon ratings">
              <FaStar />
            </div>

            <h2>{stats.totalRatings}</h2>

            <p>Total Ratings</p>

          </div>

        </div>

        {/* MODAL */}

        {showModal && (
          <div className="modal-overlay">

            <div className="modal">

              <h2>Create User</h2>

              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />

              <div className="password-wrapper">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                />

                <span
                  className="eye-icon"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </span>

              </div>

              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
              />

              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                  })
                }
              >
                <option value="USER">USER</option>
                <option value="OWNER">OWNER</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <div className="modal-buttons">

                <button
                  className="save-btn"
                  onClick={handleCreateUser}
                >
                  Create User
                </button>

                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </>
  );
}

export default Dashboard;