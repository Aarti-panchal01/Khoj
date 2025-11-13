const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { signupSchema, loginSchema } = require('../utils/validators');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const createToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      email: user.email,
      college: user.college,
      campus: user.campus || null,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

router.post('/signup', async (req, res) => {
  try {
    const payload = signupSchema.parse(req.body);
    const existing = await User.findOne({ email: payload.email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);
    const user = await User.create({
      name: payload.name,
      email: payload.email,
      passwordHash,
      phone: payload.phone,
      college: payload.college,
      campus: payload.campus || '',
    });

    const token = createToken(user);
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        campus: user.campus,
        reputation: user.reputation,
      },
    });
  } catch (error) {
    console.error('Signup error', error);
    if (error.name === 'ZodError') {
      const firstError = error.errors[0];
      const field = firstError.path.join('.');
      return res.status(400).json({
        message: `${field}: ${firstError.message}`,
        field,
        errors: error.errors
      });
    }
    return res.status(500).json({ message: 'Failed to create account' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await User.findOne({ email: payload.email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(payload.password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.college.toLowerCase() !== payload.college.toLowerCase()) {
      return res.status(403).json({ message: 'College mismatch' });
    }

    if (payload.campus && user.campus && user.campus.toLowerCase() !== payload.campus.toLowerCase()) {
      return res.status(403).json({ message: 'Campus mismatch' });
    }

    const token = createToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        campus: user.campus,
        reputation: user.reputation,
      },
    });
  } catch (error) {
    console.error('Login error', error);
    if (error.name === 'ZodError') {
      const firstError = error.errors[0];
      const field = firstError.path.join('.');
      return res.status(400).json({
        message: `${field}: ${firstError.message}`,
        field,
        errors: error.errors
      });
    }
    return res.status(500).json({ message: 'Failed to login' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  const user = req.user;
  return res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    college: user.college,
    campus: user.campus,
    reputation: user.reputation,
  });
});

module.exports = router;
