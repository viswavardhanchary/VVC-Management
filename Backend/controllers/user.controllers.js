const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { generateToken } = require('../middlewares/user.auth');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

async function addUser(req, res) {
	try {
		const { name, email, password ,role} = req.body;
		if (!name || !email || !password) {
			return res.status(400).json({ message: 'name, email and password are required' });
		}

		const existing = await User.findOne({ email: email.toLowerCase() });
		if (existing) return res.status(409).json({ message: 'Email already registered' });

    
		const hashed = await bcrypt.hash(password, SALT_ROUNDS);
		const user = await User.create({ name, email: email.toLowerCase(), password: hashed , role});

		const token = generateToken(user._id.toString());

		return res.status(201).json({ token, user: { id: user._id.toString(), name: user.name } });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function login(req, res) {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).json({ message: 'email and password required' });

		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user) return res.status(401).json({ message: 'Invalid credentials' });

		const match = await bcrypt.compare(password, user.password);
		if (!match) return res.status(401).json({ message: 'Invalid credentials' });

		const token = generateToken(user._id.toString());

		return res.json({ token, user: { id: user._id.toString(), name: user.name } });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function getUser(req, res) {
	try {
		const userId = req.userId;
		if (!userId) return res.status(401).json({ message: 'Unauthorized' });

		const user = await User.findById(userId).select('name');
		if (!user) return res.status(404).json({ message: 'User not found' });

		return res.json({ id: user._id.toString(), name: user.name });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function getFull(req, res) {
	try {
		const userId = req.userId;
		if (!userId) return res.status(401).json({ message: 'Unauthorized' });

		const user = await User.findById(userId).select('-password');
		if (!user) return res.status(404).json({ message: 'User not found' });

		return res.json({ user });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function verify(req, res) {
	try {
		// auth middleware will set req.userId
		const userId = req.userId;
		if (!userId) return res.status(401).json({ message: 'Invalid token' });

		const user = await User.findById(userId).select('name');
		if (!user) return res.status(404).json({ message: 'User not found' });

		return res.json({ id: user._id.toString(), name: user.name });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function updateUser(req, res) {
	try {
		const userId = req.userId;
		if (!userId) return res.status(401).json({ message: 'Unauthorized' });

		const updates = { ...req.body };
		// prevent updating protected fields
		delete updates._id;
		delete updates.id;

		if (updates.email) updates.email = updates.email.toLowerCase();

		if (updates.password) {
			updates.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
		}

		const updated = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
		if (!updated) return res.status(404).json({ message: 'User not found' });

		return res.json({ user: updated });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function deleteUser(req, res) {
	try {
		const userId = req.userId;
		if (!userId) return res.status(401).json({ message: 'Unauthorized' });

		const deleted = await User.findByIdAndDelete(userId);
		if (!deleted) return res.status(404).json({ message: 'User not found' });

		return res.json({ message: 'User deleted' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

module.exports = { addUser, login, getUser, getFull, verify, updateUser, deleteUser };
