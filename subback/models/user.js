const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

// Create a new user
async function createUser(user) {
    const db = getDB();

    // Convert 'plan' to 'subscription' if needed
    const formattedUser = {
        name: user.name,
        email: user.email,
        subscription: user.plan || 'basic' // default to 'basic' if not provided
    };

    return await db.collection('users').insertOne(formattedUser);
}

// Get user by ID
async function getUserById(id) {
    const db = getDB();
    if (!ObjectId.isValid(id)) return null;

    return await db.collection('users').findOne({ _id: new ObjectId(id) });
}

module.exports = {
    createUser,
    getUserById
};
