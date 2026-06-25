const express = require("express");
const router = express.Router();

const { register, login, changePassword } = require("../controllers/authController");
const {authenticateUser,authorizeRoles} = require("../middleware/authMiddleware");



router.post("/register", register);
router.post("/login", login);

router.put(
    "/change-password",
    authenticateUser,
    changePassword
);

router.get(
    "/admin-dashboard",
    authenticateUser,
    authorizeRoles("ADMIN"),
    (req, res) => {
        res.json({
            message: "Welcome Admin"
        });
    }
);

module.exports = router;