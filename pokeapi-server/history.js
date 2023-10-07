const router = require('express').Router();

// GET /history/search
router.get('/search', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const collection = db.collection('SearchHistory');

        const history = await collection.find({}).toArray();
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;
