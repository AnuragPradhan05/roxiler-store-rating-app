import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import API from "../api/axios";
import "./Navbar.css";

function Navbar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleLogout = () => {
    logout();

    Swal.fire({
      icon: "success",
      title: "Logged out",
      timer: 1000,
      showConfirmButton: false,
    });

    navigate("/");
  };

  const handleChangePassword = async () => {
    try {
      await API.put("/auth/change-password", passwordData);

      Swal.fire({
        icon: "success",
        title: "Password Updated",
        timer: 1200,
        showConfirmButton: false,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });

      setShowPasswordModal(false);
    } catch (error) {
      Swal.fire("Error", "Password update failed", "error");
    }
  };

  return (
    <>
      <nav className="navbar">

        <div className="logo">
          Store<span>Sense</span>
        </div>

        <div className="nav-links">

          {role === "ADMIN" && (
            <>
              <Link to="/admin/dashboard">Dashboard</Link>
              <Link to="/admin/users">Users</Link>
              <Link to="/admin/stores">Stores</Link>
            </>
          )}

          {role === "OWNER" && (
            <Link to="/owner/dashboard">Dashboard</Link>
          )}

          {role === "USER" && (
            <Link to="/stores">Stores</Link>
          )}

          <div className="profile">

            <button
              className="profile-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              👤
            </button>

            {showMenu && (
              <div className="dropdown">

                <button
                  onClick={() => {
                    setShowPasswordModal(true);
                    setShowMenu(false);
                  }}
                >
                  Change Password
                </button>

                <button onClick={handleLogout}>
                  Logout
                </button>

              </div>
            )}
          </div>

        </div>
      </nav>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">

            <h2>Change Password</h2>

            <input
              type="password"
              placeholder="Current password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="New password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />

            <div className="modal-buttons">
              <button
                className="save-btn"
                onClick={handleChangePassword}
              >
                Update
              </button>

              <button
                className="close-btn"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;