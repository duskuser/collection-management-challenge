const express = require('express');
const multer = require('multer');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_token';

// Utility function / classes
const ServerLogger = require('../util/ServerLogger.js');
const NoteHandler = require('../util/NoteHandler.js');

// Middleware
const upload = multer();
const authenticateConnection = require('../util/authMiddleware.js');

// Passes notes associated with user to client after authentication
router.get('/user-notes', authenticateConnection, async (req, res) => {
    ServerLogger.log("Request received to get user notes");

    if (!req.user?.id) return res.status(400).json({ message: 'Error sending token data' });

    ServerLogger.processing("Searching for user...");
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user) {
        ServerLogger.success("User found!");
        ServerLogger.processing("Finding notes associated with user object...");
        const notes = await Promise.all(
            user.entries.map((key) => prisma.note.findUnique({ where: { generatedKey: key } }))
        );
        const validNotes = notes.filter(note => note !== null);


        ServerLogger.success("All user notes processed, sending to client!");
        res.status(200).json({ message: "Notes found", notes: validNotes });
    } else {
        ServerLogger.failed("User not found, redirecting user...");
        res.status(404).json({ message: "User not found, redirect to create user..." });
    }
});

// Creates note object and appends user object with generatedKey object for later lookup
router.post('/note', authenticateConnection, upload.none(), async (req, res) => {
    ServerLogger.log("Request received to add user note");

    if (!req.user?.id) return res.status(400).json({ message: 'Error sending token data' });


    ServerLogger.processing("Searching for user...");
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user) {
        ServerLogger.success("User found!");
        ServerLogger.processing("Creating note object...");

        const newNote = {
            title: req.body.title,
            body: req.body.body,
            owner: user.username,
            generatedKey: NoteHandler.generateKey(),
            updateTimes: [],
        };
        ServerLogger.success("Note object created with key: " + newNote.generatedKey);
        ServerLogger.processing("Saving note to database...");

        const submittedNote = await prisma.note.create({
            data: newNote,
        });

        if (submittedNote) {
            ServerLogger.success("Note saved to database!");
            ServerLogger.processing("Saving note key to user object...");
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    entries: {
                        push: submittedNote.generatedKey,
                    },
                },
            });
            ServerLogger.success("User updated!");
            ServerLogger.log("Sending to client");
            return res.status(201).json({
                message: "Note created successfully!",
                note: submittedNote,
                user: user,
            });
        }

    } else {
        ServerLogger.failed("User not found, redirecting user...");
        res.status(404).json({ message: "User not found, redirect to create user..." });
    }
});

router.post('/update-note', authenticateConnection, upload.none(), async (req, res) => {
    ServerLogger.log("Request received to update user note");

    if (!req.user?.id) return res.status(400).json({ message: 'Error sending token data' });

    console.log(req.body);

    ServerLogger.processing("Searching for note...");

    const note = await prisma.note.findUnique({ where: { generatedKey: req.body.key } });

    if (note) {
        ServerLogger.success("Note found!");
        ServerLogger.processing("Updating note: " + req.body.key);

        const updatedNote = await prisma.note.update({
            where: { generatedKey: req.body.key },
            data: {
                title: req.body.title,
                body: req.body.body,
                updateTimes: NoteHandler.updateTimeArray(note.updateTimes),
            },
        });

        ServerLogger.success("Note updated!");
        return res.status(201).json({
            message: "Note updated successfully!",
            note: updatedNote,
        });
    } else {
        // No note found, update client
        if (!note) {
            ServerLogger.failed("Note not found.");
            return res.status(404).json({ message: "Note not found." });
        }
    }
});

router.post('/delete-note', authenticateConnection, upload.none(), async (req, res) => {
    ServerLogger.log("Request received to delete user note");

    if (!req.user?.id) return res.status(400).json({ message: 'Error sending token data' });

    ServerLogger.processing("Searching for user...");
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user) {
        ServerLogger.success("User found!");

        // Delete key from user.entries
        const updatedEntries = user.entries.filter(key => key !== req.body.key);
        // Stores user object, though it's not presently used 
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { entries: updatedEntries }
        });

        ServerLogger.success("Key deleted from user entries!");

        ServerLogger.processing("Searching for note...");
        const note = await prisma.note.findUnique({ where: { generatedKey: req.body.key } });

        if (!note) {
            ServerLogger.failed("Note not found.");
            return res.status(404).json({ message: "Note not found." });
        }

        // Delete the note from the database
        const newUser = await prisma.note.delete({ where: { generatedKey: req.body.key } });

        ServerLogger.success("Note deleted from database!");

        return res.status(200).json({ message: "Note successfully deleted.", user: newUser });
    } else {
        ServerLogger.failed("User not found.");
        return res.status(404).json({ message: "User not found." });
    }
});


module.exports = router;