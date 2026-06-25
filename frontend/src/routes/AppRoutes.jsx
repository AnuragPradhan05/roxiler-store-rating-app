import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";

import AdminDashboard from "../pages/admin/Dashboard";
import OwnerDashboard from "../pages/owner/Dashboard";
import StoreList from "../pages/user/StoreList";
import Users from "../pages/admin/Users";
import Stores from "../pages/admin/Stores";

import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="ADMIN">
              <AdminDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="OWNER">
              <OwnerDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/stores"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="USER">
              <StoreList />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
            <ProtectedRoute>
            <RoleRoute allowedRole="ADMIN">
                <Users />
            </RoleRoute>
            </ProtectedRoute>
        }
        />

        <Route
            path="/admin/stores"
            element={
                <ProtectedRoute>
                <RoleRoute allowedRole="ADMIN">
                    <Stores />
                </RoleRoute>
                </ProtectedRoute>
            }
        />
    </Routes>
  );
}

export default AppRoutes;