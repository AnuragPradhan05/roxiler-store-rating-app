const pool = require("../config/db");
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");

const getDashboard = async (req, res) => {
    try {

        const totalUsers = await pool.query(
            "SELECT COUNT(*) FROM users"
        );

        const totalStores = await pool.query(
            "SELECT COUNT(*) FROM stores"
        );

        const totalRatings = await pool.query(
            "SELECT COUNT(*) FROM ratings"
        );

        logger(`Admin ${req.user.id} accessed dashboard`);

        res.json({
            totalUsers: parseInt(totalUsers.rows[0].count),
            totalStores: parseInt(totalStores.rows[0].count),
            totalRatings: parseInt(totalRatings.rows[0].count)
        });

    } catch (error) {

        logger(`Dashboard Error: ${error.message}`);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

const getAllUsers = async (req, res) => {
    try {

        const users = await pool.query(`
            SELECT
                id,
                name,
                email,
                address,
                role
            FROM users
            ORDER BY id
        `);

        logger(`Admin ${req.user.id} fetched all users`);

        res.json(users.rows);

    } catch (error) {

        logger(`Get Users Error: ${error.message}`);

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

        logger(`Admin ${req.user.id} fetched all stores`);

        res.json(stores.rows);

    } catch (error) {

        logger(`Get Stores Error: ${error.message}`);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

const getUserById = async (req, res) => {
    try {

        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid User ID"
            });
        }

        const user = await pool.query(
            `
            SELECT
                id,
                name,
                email,
                address,
                role
            FROM users
            WHERE id = $1
            `,
            [id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const userData = user.rows[0];

        let ownerRating = null;

        if (userData.role === "OWNER") {

            const ratingResult = await pool.query(
                `
                SELECT
                    COALESCE(AVG(r.rating), 0) AS owner_rating
                FROM stores s
                LEFT JOIN ratings r
                ON s.id = r.store_id
                WHERE s.owner_id = $1
                `,
                [id]
            );

            ownerRating = Number(
                ratingResult.rows[0].owner_rating
            );
        }

        logger(
            `Admin ${req.user.id} viewed user ${id}`
        );

        res.json({
            ...userData,
            ownerRating
        });

    } catch (error) {

        logger(
            `Get User Error: ${error.message}`
        );

        res.status(500).json({
            message: "Server Error"
        });
    }
};

const updateUser = async (req, res) => {
    try {

        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid User ID"
            });
        }

        const {
            name,
            email,
            address,
            role
        } = req.body;

        const existingUser = await pool.query(
            `
            SELECT *
            FROM users
            WHERE id = $1
            `,
            [id]
        );

        if (existingUser.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (email) {

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    message: "Invalid Email Format"
                });
            }

            const emailExists = await pool.query(
                `
                SELECT *
                FROM users
                WHERE email = $1
                AND id != $2
                `,
                [email, id]
            );

            if (emailExists.rows.length > 0) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }
        }

        const validRoles = [
            "ADMIN",
            "USER",
            "OWNER"
        ];

        if (role && !validRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid Role"
            });
        }

        if (
            address &&
            (
                address.trim().length < 5 ||
                address.trim().length > 400
            )
        ) {
            return res.status(400).json({
                message:
                    "Address must be between 5 and 400 characters"
            });
        }

        const updatedUser = await pool.query(
            `
            UPDATE users
            SET
                name = COALESCE($1, name),
                email = COALESCE($2, email),
                address = COALESCE($3, address),
                role = COALESCE($4, role)
            WHERE id = $5
            RETURNING
                id,
                name,
                email,
                address,
                role
            `,
            [
                name,
                email,
                address,
                role,
                id
            ]
        );

        logger(
            `Admin ${req.user.id} updated user ${id}`
        );

        res.json({
            message: "User Updated Successfully",
            user: updatedUser.rows[0]
        });

    } catch (error) {

        logger(
            `Update User Error: ${error.message}`
        );

        res.status(500).json({
            message: "Server Error"
        });
    }
};

const createUser = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            address,
            role
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !address ||
            !role
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({
                message:
                "Name must be between 20 and 60 characters"
            });
        }

        if (
            address &&
            (
                address.trim().length < 5 ||
                address.trim().length > 400
            )
        ) {
            return res.status(400).json({
                message:
                    "Address must be between 5 and 400 characters"
            });
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid Email Format"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        if (address.trim().length < 5) {
            return res.status(400).json({
                message: "Address must be at least 5 characters"
            });
        }

        const validRoles = [
            "ADMIN",
            "USER",
            "OWNER"
        ];

        if (!validRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid Role"
            });
        }

        const existingUser = await pool.query(
            `
            SELECT *
            FROM users
            WHERE email = $1
            `,
            [email.trim().toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            `
            INSERT INTO users
            (
                name,
                email,
                password,
                address,
                role
            )
            VALUES($1,$2,$3,$4,$5)
            RETURNING
                id,
                name,
                email,
                address,
                role
            `,
            [
                name.trim(),
                email.trim().toLowerCase(),
                hashedPassword,
                address.trim(),
                role
            ]
        );

        logger(
            `Admin ${req.user.id} created ${role} user ${email}`
        );

        res.status(201).json({
            message: "User Created Successfully",
            user: newUser.rows[0]
        });

    } catch (error) {

        logger(
            `Create User Error: ${error.message}`
        );

        res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    getDashboard,
    getAllUsers,
    getAllStores,
    getUserById,
    updateUser,
    createUser
};