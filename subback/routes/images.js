const express = require('express');
const router = express.Router();
const { getDB } = require('../config/database');

// POST /api/images - Add image metadata
router.post('/', async (req, res) => {
    const db = getDB();
    const { plan, url } = req.body;

    if (!plan || !url) {
        return res.status(400).json({ message: 'Plan and URL are required' });
    }

    try {
        const result = await db.collection('images').insertOne({ plan, url });
        res.status(201).json({ message: 'Image added', imageId: result.insertedId });
    } catch (err) {
        console.error('Error adding image:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/images/:plan - Get images for a plan
router.get('/:plan', async (req, res) => {
    const db = getDB();
    const plan = req.params.plan.toLowerCase();

    try {
        const images = await db.collection('images').find({ plan }).toArray();

        if (!images.length) {
            return res.status(404).json({ message: 'No images found for this plan' });
        }

        res.json({ images });
    } catch (err) {
        console.error('Error fetching images:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
