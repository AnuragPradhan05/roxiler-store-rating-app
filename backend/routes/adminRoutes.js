const express = require("express");
const router = express.Router();

const { getDashboard,getAllUsers,getAllStores, getUserById, updateUser } = require("../controllers/adminController");

const {
    authenticateUser,
    authorizeRoles
} = require("../middleware/authMiddleware");

router.get(
    "/dashboard",
    authenticateUser,
    authorizeRoles("ADMIN"),
    getDashboard
);

router.get(
    "/users",
    authenticateUser,
    authorizeRoles("ADMIN"),
    getAllUsers
);

router.get(
    "/stores",
    authenticateUser,
    authorizeRoles("ADMIN"),
    getAllStores
);

router.get(
    "/users/:id",
    authenticateUser,
    authorizeRoles("ADMIN"),
    getUserById
);

router.put(
    "/users/:id",
    authenticateUser,
    authorizeRoles("ADMIN"),
    updateUser
);

module.exports = router;