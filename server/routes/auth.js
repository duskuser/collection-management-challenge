const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_token';

// Utility function / classes
const ServerLogger = require('../util/ServerLogger.js');

// Middleware
const upload = multer();
const authenticateConnection = require('../util/authMiddleware.js');

// API Routes

router.get('/authenticated_user', authenticateConnection, async (req, res) => {
    ServerLogger.log("Request receieved to get authenticated user object");
    // Validates input before attempting to query
    if (!req.user?.id) return res.status(400).json({ message: 'Error sending token data' });

    ServerLogger.processing("Searching for user...");
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user) {
        // Removes password from user object and sends to client
        ServerLogger.success("User found! Sending to client...");
        const { password, ...safeUser } = user;
        res.status(200).json({ message: "User found", user: safeUser });
    } else {
        ServerLogger.failed("User not found, redirecting user...");
        res.status(404).json({ message: "User not found, redirect to create user..." });
    }
});

router.post('/login', upload.none(), async (req, res) => {
    ServerLogger.log("Attempt to log in user received...");
    const { email, password } = req.body || {};

    ServerLogger.processing("Validating data...");
    // Basic data validation
    if (!email || !password) {
        ServerLogger.failed("Incomplete fields!");
        ServerLogger.log("Notifying client");
        return res.status(400).json({
            message: 'All fields (username, email, password) are required.',
        });
    }

    ServerLogger.success("User data verified!");
    ServerLogger.processing("Searching for user...");
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        ServerLogger.failed("User not found!");
        ServerLogger.log("Notifying client");
        return res.status(401).json({ message: 'Incorrect username or password!' });
    }

    ServerLogger.success("Matching email found!");
    ServerLogger.processing("Verifying password...");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        ServerLogger.failed("Invalid password!");
        ServerLogger.log("Notifying client");
        return res.status(401).json({ message: 'Incorrect username or password!' });
    }
    ServerLogger.success("Password matches!");
    ServerLogger.processing("Generating JWT token for client...");

    // Create JWT token for user
    const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    ServerLogger.success("Token created, logging in!");
    res.status(201).json({
        message: 'Logging in!',
        token,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
        },
    });
});

router.post('/signup', upload.none(), async (req, res) => {
    ServerLogger.log("Request to sign up user received");
    ServerLogger.log(req.body);
    const { username, email, password } = req.body || {};

    // Basic data validation
    ServerLogger.processing("Validating user data...");
    if (!username || !email || !password) {
        ServerLogger.failed("Error validating data!");
        ServerLogger.processing("Returning...");
        return res.status(400).json({
            message: 'All fields (username, email, password) are required.',
        });
    }
    ServerLogger.success("User data validated!");

    ServerLogger.processing("Creating user...");
    try {
        const hashed = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashed,
                entries: [],
            },
        });

        // Create JWT token for user
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        ServerLogger.success("User created, logging in!");
        res.status(201).json({
            message: 'User created, logging in!',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        });
    } catch (error) {
        // Unique fields already in use
        // Currently username and email
        if (
            error.code === 'P2002' &&
            error.meta &&
            Array.isArray(error.meta.target)
        ) {
            const fields = error.meta.target;
            ServerLogger.failed(`${fields.join(' & ')} taken, unable to create user!`);
            return res.status(409).json({
                message: `${fields.join(' & ')} taken!`,
                fields,
                code: 'DUPLICATE_FIELD',
            });
        }

        // Generic error handling
        ServerLogger.failed('Signup error:', error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later or contact support.',
        });
    }
});

module.exports = router;
