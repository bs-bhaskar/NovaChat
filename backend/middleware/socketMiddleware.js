const jwt = require('jsonwebtoken');

const socketMiddleware = (socket, next) => {
    const authHeader = socket.handshake.headers['authorization'];

    const token =
        socket.handshake.auth?.token ||
        (authHeader?.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : null);

    if (!token) {
        return next(new Error('Authorization token missing'));
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        socket.user = decode;

        next();
    } catch (error) {
        console.error("Socket authentication error:", error);
        next(new Error('Invalid or expired token'));
    }
};

module.exports = socketMiddleware;