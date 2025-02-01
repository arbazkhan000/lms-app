import jwt from 'jsonwebtoken';
import User from '../model/user.schema.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided. Authentication failed.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found. Authentication failed.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.', error: error.message });
    }
};

const adminMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided. Authentication failed.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found. Authentication failed.' });
        }

        if (user.role === 'admin') {
            req.user = user;
            next();
        } else {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.', error: error.message });
    }
};

export { authMiddleware, adminMiddleware };
