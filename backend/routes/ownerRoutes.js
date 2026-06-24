const express = require("express");

const router = express.Router();

const {
    getOwnerDashboard
} = require("../controllers/ownerController");

const {
    authenticateUser,
    authorizeRoles
} = require("../middleware/authMiddleware");

router.get(
    "/dashboard",
    authenticateUser,
    authorizeRoles("OWNER"),
    getOwnerDashboard
);

module.exports = router;