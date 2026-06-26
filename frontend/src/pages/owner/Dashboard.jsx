import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import "./Dashboard.css";
import {
  FaStore,
  FaStar,
  FaUsers,
  FaEnvelope,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

function Dashboard() {
  const [data, setData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/owners/dashboard");
      setData(res.data);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to load dashboard",
        "error"
      );
    }
  };

  if (!data) {
    return (
      <div className="loading">
        Loading dashboard...
      </div>
    );
  }

  // pagination logic
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = data.users.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.users.length / usersPerPage);

  return (
    <>
      <Navbar />

      <div className="owner-dashboard">

        <h1 className="title">Owner Dashboard</h1>

        {/* KPI Cards */}
        <div className="owner-cards">

          <div className="owner-card">
            <div className="card-icon">
              <FaStore />
            </div>

            <h3>Store Name</h3>
            <p>{data.store.name}</p>
          </div>


            <div className="owner-card highlight">
              <div className="card-icon rating-icon">
                <FaStar />
              </div>

              <h3>Average Rating</h3>
              <p>{data.averageRating.toFixed(1)}</p>
            </div>

            <div className="owner-card">
              <div className="card-icon users-icon">
                <FaUsers />
              </div>

              <h3>Total Ratings</h3>
              <p>{data.totalRatings}</p>
            </div>

        </div>

        {/* Store Info */}
        <div className="store-info">

          <h2>Store Information</h2>

          <div className="info-grid">

            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div>
                <span>Email</span>
                <strong>{data.store.email}</strong>
              </div>
            </div>

            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <span>Address</span>
                <strong>{data.store.address}</strong>
              </div>
            </div>

          </div>

        </div>

        {/* Ratings Table */}
        <div className="ratings-section">

          <h2>Customer Ratings</h2>

          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                  <span className="rating">
                    <FaStar />
                    {user.rating}
                  </span>
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
              <FaChevronLeft />
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <FaChevronRight />
            </button>
          </div>

        </div>

      </div>
    </>
  );
}

export default Dashboard;