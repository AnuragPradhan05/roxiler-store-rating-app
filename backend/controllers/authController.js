const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const register = async (req, res) => {
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
            address.trim().length < 5 ||
            address.trim().length > 400
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

        const passwordRegex =
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                "Password must be 8-16 chars and contain one uppercase letter and one special character"
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

        const userExists = await pool.query(
            `
            SELECT *
            FROM users
            WHERE email = $1
            `,
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const result = await pool.query(
            `
            INSERT INTO users
            (
                name,
                email,
                password,
                address,
                role
            )
            VALUES ($1,$2,$3,$4,$5)
            RETURNING
                id,
                name,
                email,
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
            `User Registered: ${email} (${role})`
        );

        res.status(201).json({
            message: "User Registered",
            user: result.rows[0]
        });

    } catch (error) {

        logger(
            `Register Error: ${error.message}`
        );

        res.status(500).json({
            message: "Server Error"
        });
    }
};

const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Email and Password are required"
            });
        }

        const result = await pool.query(
            `
            SELECT *
            FROM users
            WHERE email = $1
            `,
            [email.trim().toLowerCase()]
        );

        if (result.rows.length === 0) {

            logger(
                `Failed Login Attempt: ${email}`
            );

            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        const user = result.rows[0];

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {

            logger(
                `Failed Login Attempt: ${email}`
            );

            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        logger(
            `Login Success: ${user.email} (${user.role})`
        );

        res.json({
            token,
            role: user.role
        });

    } catch (error) {

        logger(
            `Login Error: ${error.message}`
        );

        res.status(500).json({
            message: "Server Error"
        });
    }
};

const changePassword = async (req, res) => {
    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        const userId = req.user.id;

        if (
            !currentPassword ||
            !newPassword
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "New password must be at least 8 characters"
            });
        }

        const userResult = await pool.query(
            `
            SELECT *
            FROM users
            WHERE id = $1
            `,
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = userResult.rows[0];

        const isMatch =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );

        await pool.query(
            `
            UPDATE users
            SET password = $1
            WHERE id = $2
            `,
            [
                hashedPassword,
                userId
            ]
        );

        logger(
            `User ${userId} changed password`
        );

        res.json({
            message: "Password changed successfully"
        });

    } catch (error) {

        logger(
            `Change Password Error: ${error.message}`
        );

        res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    register,
    login,
    changePassword
};