const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');


const app = express();
const PORT = 4000;

// Utility function / classes
const ServerLogger = require('./util/ServerLogger.js');

app.use(cors());
app.use(express.json());

// Mount routes to /api
app.use('/api', authRoutes);
app.use('/api', noteRoutes);

app.listen(PORT, () => {
    ServerLogger.success(`Server is running on http://localhost:${PORT}`);
});
