const jwt = require('jsonwebtoken');
const ServerLogger = require('./ServerLogger'); 
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateConnection = (req, res, next) => {
    ServerLogger.log("Request received to authenticate user");
    ServerLogger.processing("Verifying headers...");
    const token = req.headers.authorization?.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        ServerLogger.success("Headers verified!");
        next();
    } catch (err) {
        ServerLogger.failed("JWT verification failed: ", err);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authenticateConnection;