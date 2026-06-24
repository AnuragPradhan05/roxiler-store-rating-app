const pool = require("../config/db");
const logger = require("../utils/logger");

const submitRating = async (req, res) => {
    try {

        const { store_id, rating } = req.body;

        const user_id = req.user.id;

        if (!store_id || rating === undefined) {
            return res.status(400).json({
                message: "Store ID and Rating are required"
            });
        }

        if (isNaN(store_id)) {
            return res.status(400).json({
                message: "Invalid Store ID"
            });
        }

        if (isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        const storeExists = await pool.query(
            `
            SELECT *
            FROM stores
            WHERE id = $1
            `,
            [store_id]
        );

        if (storeExists.rows.length === 0) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        const existingRating = await pool.query(
            `
            SELECT *
            FROM ratings
            WHERE user_id = $1
            AND store_id = $2
            `,
            [user_id, store_id]
        );

        if (existingRating.rows.length > 0) {
            return res.status(400).json({
                message: "Rating already submitted. Use update rating."
            });
        }

        const result = await pool.query(
            `
            INSERT INTO ratings
            (
                user_id,
                store_id,
                rating
            )
            VALUES($1,$2,$3)
            RETURNING *
            `,
            [
                user_id,
                store_id,
                rating
            ]
        );

        logger(
            `User ${user_id} submitted rating ${rating} for store ${store_id}`
        );

        res.status(201).json({
            message: "Rating submitted successfully",
            rating: result.rows[0]
        });

    } catch (error) {

        logger(
            `Submit Rating Error: ${error.message}`
        );

        res.status(500).json({
            message: "Server Error"
        });
    }
};

const updateRating = async (req, res) => {
    try {

        const { store_id, rating } = req.body;

        const user_id = req.user.id;

        if (!store_id || rating === undefined) {
            return res.status(400).json({
                message: "Store ID and Rating are required"
            });
        }

        if (isNaN(store_id)) {
            return res.status(400).json({
                message: "Invalid Store ID"
            });
        }

        if (isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        const storeExists = await pool.query(
            `
            SELECT *
            FROM stores
            WHERE id = $1
            `,
            [store_id]
        );

        if (storeExists.rows.length === 0) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        const existingRating = await pool.query(
            `
            SELECT *
            FROM ratings
            WHERE user_id = $1
            AND store_id = $2
            `,
            [user_id, store_id]
        );

        if (existingRating.rows.length === 0) {
            return res.status(404).json({
                message: "Rating not found"
            });
        }

        const updatedRating = await pool.query(
            `
            UPDATE ratings
            SET rating = $1
            WHERE user_id = $2
            AND store_id = $3
            RETURNING *
            `,
            [
                rating,
                user_id,
                store_id
            ]
        );

        logger(
            `User ${user_id} updated rating to ${rating} for store ${store_id}`
        );

        res.json({
            message: "Rating updated successfully",
            rating: updatedRating.rows[0]
        });

    } catch (error) {

        logger(
            `Update Rating Error: ${error.message}`
        );

        res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    submitRating,
    updateRating
};