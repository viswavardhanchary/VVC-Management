const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const TOKEN_EXPIRES_IN = '30d'; // 30 days

function generateToken(userId) {
	// token payload contains only the MongoDB _id
	return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
}

async function authMiddleware(req, res, next) {
	try {
		const authHeader = req.headers.authorization || req.headers.Authorization || '';
		let token = null;

		if (authHeader && authHeader.startsWith('Bearer ')) {
			token = authHeader.split(' ')[1];
		} else if (req.query && req.query.token) {
			token = req.query.token;
		} else if (req.headers.token) {
			token = req.headers.token;
		}

		if (!token) return res.status(401).json({ message: 'No token provided' });

		const decoded = jwt.verify(token, JWT_SECRET);
		// attach user id to request
		req.userId = decoded.id;
		req.token = token;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
}

module.exports = { authMiddleware, generateToken };
