import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to load users", "error");
    }
  };

  const fetchUserDetails = async (id) => {
    try {
      const res = await API.get(`/admin/users/${id}`);

      setSelectedUser(res.data);
      setFormData({
        name: res.data.name,
        email: res.data.email,
        address: res.data.address,
        role: res.data.role,
      });

      setEditMode(false);
      setShowModal(true);
    } catch (error) {
      Swal.fire("Error", "Failed to load user details", "error");
    }
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/admin/users/${selectedUser.id}`, formData);

      Swal.fire({
        icon: "success",
        title: "Updated",
        timer: 1200,
        showConfirmButton: false,
      });

      setShowModal(false);
      fetchUsers();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Update failed",
        "error"
      );
    }
  };

  // filtering
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // pagination logic
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <>
      <Navbar />

      <div className="users-container">

        <div className="users-header">
          <h1>User Management</h1>

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-box"
          />
        </div>

        {filteredUsers.length === 0 ? (
          <p className="empty">No users found</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>
                      <span className={`role ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => fetchUserDetails(user.id)}
                      >
                        View
                      </button>

                      <button
                        className="edit-btn"
                        onClick={async () => {
                          await fetchUserDetails(user.id);
                          setEditMode(true);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Modal */}
        {showModal && selectedUser && (
          <div className="modal-overlay">
            <div className="modal">

              <h2>
                {editMode ? "Edit User" : "User Details"}
              </h2>

              {editMode ? (
                <>
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                  />

                  <input
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                  />

                  <input
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
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                    <option value="OWNER">OWNER</option>
                  </select>

                  <button
                    className="save-btn"
                    onClick={handleUpdate}
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <div className="detail-row">
                    <span>ID</span>
                    <strong>{selectedUser.id}</strong>
                  </div>

                  <div className="detail-row">
                    <span>Name</span>
                    <strong>{selectedUser.name}</strong>
                  </div>

                  <div className="detail-row">
                    <span>Email</span>
                    <strong>{selectedUser.email}</strong>
                  </div>

                  <div className="detail-row">
                    <span>Address</span>
                    <strong>{selectedUser.address}</strong>
                  </div>

                  <div className="detail-row">
                    <span>Role</span>
                    <strong>{selectedUser.role}</strong>
                  </div>
                </>
              )}

              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>

            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default Users;