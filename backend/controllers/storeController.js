const pool = require("../config/db");
const logger = require("../utils/logger");

const addStore = async (req, res) => {
    try {

        const {
            name,
            email,
            address,
            owner_id
        } = req.body;

        if (
            !name ||
            !email ||
            !address ||
            !owner_id
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (name.trim().length < 3) {
            return res.status(400).json({
                message: "Store name must be at least 3 characters"
            });
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid Email Format"
            });
        }

        if (isNaN(owner_id)) {
            return res.status(400).json({
                message: "Invalid Owner ID"
            });
        }

        const storeExists = await pool.query(
            `
            SELECT *
            FROM stores
            WHERE email = $1
            `,
            [email]
        );

        if (storeExists.rows.length > 0) {
            return res.status(400).json({
                message: "Store email already exists"
            });
        }

        const owner = await pool.query(
            `
            SELECT *
            FROM users
            WHERE id = $1
            `,
            [owner_id]
        );

        if (owner.rows.length === 0) {
            return res.status(404).json({
                message: "Owner not found"
            });
        }

        if (owner.rows[0].role !== "OWNER") {
            return res.status(400).json({
                message: "User is not a Store Owner"
            });
        }

        const store = await pool.query(
            `
            INSERT INTO stores
            (
                name,
                email,
                address,
                owner_id
            )
            VALUES($1,$2,$3,$4)
            RETURNING *
            `,
            [
                name.trim(),
                email.trim().toLowerCase(),
                address.trim(),
                owner_id
            ]
        );

        logger(
            `Store Created: ${name} by Admin ${req.user.id}`
        );

        res.status(201).json({
            message: "Store Added Successfully",
            store: store.rows[0]
        });

    } catch (error) {

        logger(
            `Add Store Error: ${error.message}`
        );

        res.status(500).json({
            message: "Server Error"
        });
    }
};

const getAllStores = async (req, res) => {
    try {

        const stores = await pool.query(`
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                COALESCE(AVG(r.rating),0) AS average_rating
            FROM stores s
            LEFT JOIN ratings r
            ON s.id = r.store_id
            GROUP BY s.id
            ORDER BY s.id
        `);

        logger(
            `User ${req.user.id} fetched store list`
        );

        res.json(stores.rows);

    } catch (error) {

        logger(
            `Get Stores Error: ${error.message}`
        );

        res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    addStore,
    getAllStores
};