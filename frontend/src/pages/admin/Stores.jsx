import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import "./Stores.css";

import {
  FaStore,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaPlus
} from "react-icons/fa";

function Stores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");

  const [owners, setOwners] = useState([]);


  const [currentPage, setCurrentPage] = useState(1);
  const storesPerPage = 6;

  

  useEffect(() => {
    fetchStores();
    fetchOwners();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await API.get("/admin/stores");
      setStores(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to load stores", "error");
    }
  };
  const fetchOwners = async () => {
    try {
      const res = await API.get("/admin/users");

      const ownerUsers = res.data.filter(
        (user) => user.role === "OWNER"
      );

      setOwners(ownerUsers);

    } catch (error) {
      console.log(error);
    }
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase()) ||
    store.address.toLowerCase().includes(search.toLowerCase())
  );

  // pagination
  const indexOfLast = currentPage * storesPerPage;
  const indexOfFirst = indexOfLast - storesPerPage;
  const currentStores = filteredStores.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStores.length / storesPerPage);

  const handleAddStorePopup = async () => {

    const ownerOptions = owners
      .map(
        (owner) =>
          `<option value="${owner.id}">${owner.name}</option>`
      )
      .join("");

    const { value } = await Swal.fire({
      title: "Add Store",

      html: `
        <input
          id="name"
          class="swal2-input"
          placeholder="Store Name"
        >

        <input
          id="email"
          class="swal2-input"
          placeholder="Store Email"
        >

        <input
          id="address"
          class="swal2-input"
          placeholder="Store Address"
        >

        <select
          id="owner"
          class="swal2-select"
        >
          <option value="">Select Owner</option>
          ${ownerOptions}
        </select>
      `,

      showCancelButton: true,
      confirmButtonText: "Add Store",

      preConfirm: () => {

        const data = {
          name: document.getElementById("name").value.trim(),
          email: document.getElementById("email").value.trim(),
          address: document.getElementById("address").value.trim(),
          owner_id: document.getElementById("owner").value
        };

        if (
          !data.name ||
          !data.email ||
          !data.address ||
          !data.owner_id
        ) {
          Swal.showValidationMessage(
            "Please fill all fields."
          );
          return false;
        }

        return data;
      }
    });

    if (!value) return;

    try {

      await API.post("/stores/add", value);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Store added successfully"
      });

      fetchStores();

    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Unable to add store"
      });

    }
  };
  return (
    <>
      <Navbar />

      <div className="stores-container">

        <div className="stores-header">

          <div>
            <h1>
              <FaStore className="title-icon" />
              Store Directory
            </h1>

            <p className="subtitle">
              View all registered stores and ratings
            </p>
          </div>

          <div className="search-wrapper">

            <input
              type="text"
              placeholder="Search stores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-box"
            />
          </div>

          <button
            className="add-store-btn"
            onClick={handleAddStorePopup}
          >
            <FaPlus />
            Add Store
          </button>

        </div>

        {filteredStores.length === 0 ? (
          <p className="empty">No stores found</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Store Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Rating</th>
                </tr>
              </thead>

              <tbody>
                {currentStores.map((store) => (
                  <tr key={store.id}>
                    <td>{store.id}</td>
                    <td>
                      <div className="store-name">
                        <FaStore />
                        {store.name}
                      </div>
                    </td>

                    <td>
                      <div className="store-email">
                        <FaEnvelope />
                        {store.email}
                      </div>
                    </td>

                    <td>
                      <div className="store-address">
                        <FaMapMarkerAlt />
                        {store.address}
                      </div>
                    </td>

                    <td>
                      <span className="rating-badge">
                        <FaStar />
                        {Number(store.average_rating).toFixed(1)}
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
          </>
        )}

      </div>
    </>
  );
}

export default Stores;