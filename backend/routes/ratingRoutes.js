const express = require("express");
const router = express.Router();

const { submitRating, updateRating, getMyRatings } = require("../controllers/ratingController");

const {
    authenticateUser,
    authorizeRoles
} = require("../middleware/authMiddleware");

router.get(
  "/my",
  authenticateUser,
  authorizeRoles("USER"),
  getMyRatings
);

router.post(
    "/",
    authenticateUser,
    authorizeRoles("USER"),
    submitRating
);

router.put(
    "/",
    authenticateUser,
    authorizeRoles("USER"),
    updateRating
);
module.exports = router;