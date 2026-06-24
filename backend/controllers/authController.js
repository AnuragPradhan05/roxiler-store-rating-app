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

module.exports = {
    register,
    login
};