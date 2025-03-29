// routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

// GET /api/subscribe/:userId - Get images for a user's subscription
router.get('/:userId', async (req, res) => {
    const db = getDB();
    const { userId } = req.params;

    try {
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Step 1: Get the user
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const subscriptionPlan = user.subscription;

        // Step 2: Get subscription info (optional, can be expanded later)
        const subscription = await db.collection('subscriptions').findOne({ plan: subscriptionPlan });

        // Step 3: Get all images for the user's plan
        const images = await db.collection('images').find({ plan: subscriptionPlan }).toArray();

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                subscription: subscriptionPlan
            },
            subscriptionInfo: subscription || {},
            images
        });
    } catch (err) {
        console.error('Error fetching subscription data:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/subscribe - Create a new subscription plan
router.post('/', async (req, res) => {
    const db = getDB();
    const { plan, price, accessLevel } = req.body;

    if (!plan || !price || !accessLevel) {
        return res.status(400).json({ message: 'All fields are required: plan, price, accessLevel' });
    }

    try {
        const existing = await db.collection('subscriptions').findOne({ plan });

        if (existing) {
            return res.status(409).json({ message: 'Subscription plan already exists' });
        }

        const result = await db.collection('subscriptions').insertOne({
            plan,
            price,
            accessLevel
        });

        res.status(201).json({ message: 'Subscription plan created', id: result.insertedId });
    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
