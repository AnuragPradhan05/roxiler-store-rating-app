import { Navigate } from "react-router-dom";

function RoleRoute({ allowedRole, children }) {
  const role = localStorage.getItem("role");

  if (role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export default RoleRoute;