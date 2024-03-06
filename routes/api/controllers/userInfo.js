import express from 'express';

var router = express.Router();

// Endpoint for posting new userinfo
router.post('/', async (req, res) => {
    console.log("hello 4")
    try {
        await req.models.UserInfo.updateOne(
            { username: req.session.account.username },
            {
                preferred_name: req.body.preferred_name,
                pronouns: req.body.pronouns,
                major: req.body.major,
                year: req.body.year,
                fun_fact: req.body.fun_fact
            },
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