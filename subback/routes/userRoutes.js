const express = require('express');
const router = express.Router();
const { createUser, getUserById } = require('../models/user');

// POST /api/user - Create a new user
router.post('/', async (req, res) => {
    try {
        const user = req.body;

        const result = await createUser(user);
        res.status(201).json({ message: 'User created', id: result.insertedId });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// GET /api/user/:id - Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: 'Error fetching user' });
    }
});

module.exports = router;
