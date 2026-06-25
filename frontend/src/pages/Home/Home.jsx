import { Link } from "react-router-dom";
import {
  FaStore,
  FaStar,
  FaUsers,
  FaChartLine
} from "react-icons/fa";

import "./Home.css";

function Home() {
  return (
    <div className="home-container">

      <div className="hero-card">

        <h1>
          StoreSense
        </h1>

        <p>
          A complete platform where users can
          discover stores, submit ratings,
          store owners can track performance,
          and administrators can manage the
          entire ecosystem.
        </p>

        <div className="hero-buttons">

          <Link to="/login">
            <button className="login-btn">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="register-btn">
              Register
            </button>
          </Link>

        </div>

      </div>

      <div className="features">

        <div className="feature-card">
          <FaStore size={40} />
          <h3>Store Management</h3>
          <p>
            Manage stores and monitor ratings
            effortlessly.
          </p>
        </div>

        <div className="feature-card">
          <FaStar size={40} />
          <h3>Ratings System</h3>
          <p>
            Submit, update and analyze
            customer ratings.
          </p>
        </div>

        <div className="feature-card">
          <FaUsers size={40} />
          <h3>User Management</h3>
          <p>
            Admins can manage users and
            assign roles easily.
          </p>
        </div>

        <div className="feature-card">
          <FaChartLine size={40} />
          <h3>Analytics</h3>
          <p>
            Track store performance through
            detailed dashboards.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Home;