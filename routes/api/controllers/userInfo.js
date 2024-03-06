import express from 'express';

var router = express.Router();

// Endpoint for posting new userinfo
router.post('/', async (req, res) => {
    try {
        const updateFields = {};

        if (req.body.preferred_name) {
            updateFields.preferred_name = req.body.preferred_name;
        }
        if (req.body.pronouns) {
            updateFields.pronouns = req.body.pronouns;
        }
        if (req.body.major) {
            updateFields.major = req.body.major;
        }
        if (req.body.year) {
            updateFields.year = req.body.year;
        }
        if (req.body.fun_fact) {
            updateFields.fun_fact = req.body.fun_fact;
        }

        await req.models.UserInfo.updateOne(
            { username: req.session.account.username },
            { $set: updateFields },
            { upsert: true }
        );

        res.json({ status: 'success' });
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({ status: 'error', error: error });
    }
});

// Endpoint for getting userinfo
router.get('/', async (req, res) => {
    try {
        const userInfo = await req.models.UserInfo.find({ username: req.query.username });
        console.log(userInfo)
        res.json(userInfo);
    } catch (error) {
        console.error('Error getting user information:', error);
        res.status(500).json({ status: 'error', error: error });
    }
});

export default router;