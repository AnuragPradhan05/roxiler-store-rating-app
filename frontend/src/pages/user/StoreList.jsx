import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import "./StoreList.css";

function StoreList() {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState({});
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const storesPerPage = 6;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const storesRes = await API.get("/stores");
      const ratingsRes = await API.get("/ratings/my");

      const ratingsMap = {};
      ratingsRes.data.forEach((r) => {
        ratingsMap[r.store_id] = r.rating;
      });

      setStores(storesRes.data);
      setRatings(ratingsMap);
    } catch (error) {
      Swal.fire("Error", "Failed to load stores", "error");
    }
  };

  const handleRating = async (storeId, value) => {
    const newRating = Number(value);

    try {
      const existingRating = ratings[storeId];

      // optimistic UI update (instant feel)
      setRatings((prev) => ({
        ...prev,
        [storeId]: newRating,
      }));

      if (existingRating) {
        await API.put("/ratings", {
          store_id: storeId,
          rating: newRating,
        });
      } else {
        await API.post("/ratings", {
          store_id: storeId,
          rating: newRating,
        });
      }

      Swal.fire({
        icon: "success",
        title: "Rating saved",
        timer: 1000,
        showConfirmButton: false,
      });

    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to save rating",
        "error"
      );
    }
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase())
  );

  // pagination logic
  const indexOfLast = currentPage * storesPerPage;
  const indexOfFirst = indexOfLast - storesPerPage;
  const currentStores = filteredStores.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStores.length / storesPerPage);

  return (
    <>
      <Navbar />

      <div className="store-container">

        <div className="store-header">
          <h1>Explore Stores</h1>

          <input
            type="text"
            placeholder="Search by name or address..."
            className="search-box"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredStores.length === 0 ? (
          <p className="empty">No stores found</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Avg Rating</th>
                  <th>My Rating</th>
                </tr>
              </thead>

              <tbody>
                {currentStores.map((store) => (
                  <tr key={store.id}>
                    <td className="name">{store.name}</td>
                    <td>{store.address}</td>

                    <td>
                      ⭐ {Number(store.average_rating).toFixed(1)}
                    </td>

                    <td>
                      <select
                        value={ratings[store.id] || ""}
                        onChange={(e) =>
                          handleRating(store.id, e.target.value)
                        }
                      >
                        <option value="">Rate</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
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

export default StoreList;