const pool = require("../config/db");
const logger = require("../utils/logger");

const getOwnerDashboard = async (req, res) => {
    try {

        const ownerId = req.user.id;

        const storeResult = await pool.query(
            `
            SELECT *
            FROM stores
            WHERE owner_id = $1
            `,
            [ownerId]
        );

        if (storeResult.rows.length === 0) {

            logger(
                `Owner ${ownerId} attempted dashboard access but no store found`
            );

            return res.status(404).json({
                message: "No store found for this owner"
            });
        }

        const store = storeResult.rows[0];

        const ratingsResult = await pool.query(
            `
            SELECT
                u.id,
                u.name,
                u.email,
                r.rating
            FROM ratings r
            JOIN users u
            ON r.user_id = u.id
            WHERE r.store_id = $1
            ORDER BY r.rating DESC
            `,
            [store.id]
        );

        const avgResult = await pool.query(
            `
            SELECT
                COALESCE(AVG(rating),0) AS average_rating
            FROM ratings
            WHERE store_id = $1
            `,
            [store.id]
        );

        logger(
            `Owner ${ownerId} accessed dashboard for store ${store.id}`
        );

        res.json({
            store: {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address
            },
            averageRating: Number(avgResult.rows[0].average_rating),
            totalRatings: ratingsResult.rows.length,
            users: ratingsResult.rows
        });

    } catch (error) {

        logger(
            `Owner Dashboard Error: ${error.message}`
        );

        res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    getOwnerDashboard
};