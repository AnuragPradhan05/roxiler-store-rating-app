import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import API from "../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Navbar.css";
import { FaUser } from "react-icons/fa";

function Navbar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleLogout = () => {
    logout();

    Swal.fire({
      icon: "success",
      title: "Logged Out",
      timer: 1000,
      showConfirmButton: false,
    });

    navigate("/");
  };

  const handleChangePassword = async () => {
    try {
      await API.put(
        "/auth/change-password",
        passwordData
      );

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

      setShowCurrentPassword(false);
      setShowNewPassword(false);

      setShowPasswordModal(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Password update failed",
      });
    }
  };

  const closeModal = () => {
    setShowPasswordModal(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
    });

    setShowCurrentPassword(false);
    setShowNewPassword(false);
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
              <Link to="/admin/dashboard">
                Dashboard
              </Link>

              <Link to="/admin/users">
                Users
              </Link>

              <Link to="/admin/stores">
                Stores
              </Link>
            </>
          )}

          {role === "OWNER" && (
            <Link to="/owner/dashboard">
              Dashboard
            </Link>
          )}

          {role === "USER" && (
            <Link to="/stores">
              Stores
            </Link>
          )}

          <div className="profile">
            <button
              className="profile-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FaUser />
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

                <button
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Change Password</h2>

            <div className="password-wrapper">
              <input
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                placeholder="Current Password"
                value={
                  passwordData.currentPassword
                }
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword:
                      e.target.value,
                  })
                }
              />

              <span
                className="eye-icon"
                onClick={() =>
                  setShowCurrentPassword(
                    !showCurrentPassword
                  )
                }
              >
                {showCurrentPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>
            </div>

            <div className="password-wrapper">
              <input
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                placeholder="New Password"
                value={
                  passwordData.newPassword
                }
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword:
                      e.target.value,
                  })
                }
              />

              <span
                className="eye-icon"
                onClick={() =>
                  setShowNewPassword(
                    !showNewPassword
                  )
                }
              >
                {showNewPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>
            </div>

            <div className="modal-buttons">
              <button
                className="save-btn"
                onClick={
                  handleChangePassword
                }
              >
                Update
              </button>

              <button
                className="close-btn"
                onClick={closeModal}
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