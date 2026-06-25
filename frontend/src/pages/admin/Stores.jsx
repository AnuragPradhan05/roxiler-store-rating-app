import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import "./Stores.css";

function Stores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const storesPerPage = 6;

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await API.get("/admin/stores");
      setStores(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to load stores", "error");
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

  return (
    <>
      <Navbar />

      <div className="stores-container">

        <div className="stores-header">
          <h1>Store Directory</h1>

          <input
            type="text"
            placeholder="Search by name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-box"
          />
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
                    <td className="name">{store.name}</td>
                    <td>{store.email}</td>
                    <td>{store.address}</td>
                    <td>
                      <span className="rating">
                        ⭐ {Number(store.average_rating).toFixed(1)}
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

      </div>
    </>
  );
}

export default Stores;