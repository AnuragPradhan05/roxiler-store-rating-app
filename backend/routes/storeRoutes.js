const express = require("express");
const router = express.Router();

const { addStore,getAllStores } = require("../controllers/storeController");

const {
    authenticateUser,
    authorizeRoles
} = require("../middleware/authMiddleware");

router.post(
    "/add",
    authenticateUser,
    authorizeRoles("OWNER","ADMIN"),
    addStore
);
router.get(
    "/",
    authenticateUser,
    getAllStores
);


module.exports = router;