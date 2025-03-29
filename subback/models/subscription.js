// This could be static data or fetched from DB if needed
const subscriptionPlans = {
    basic: [
        '/images/basic/pic1.jpeg'
    ],
    standard: [
        '/images/standard/pic1.jpeg',
        '/images/standard/pic2.jpg'
    ],
    premium: [
        '/images/premium/pic1.jpeg',
        '/images/premium/pic2.jpg',
        '/images/premium/pic3.jpg'
    ]
};

// Get images by subscription level
function getImagesForPlan(plan) {
    return subscriptionPlans[plan] || [];
}

module.exports = {
    getImagesForPlan
};
