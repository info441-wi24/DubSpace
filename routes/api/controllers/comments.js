import express from 'express';

var router = express.Router();
router.get('/', async(req, res) => {
    try {
        const Comment = req.models.Comment;
        const { postID } = req.query;
        const comments = await Comment.find({ post: postID })
        return res.json(comments);
    } catch(error) {
        console.error(error);
        return res.status(500).json({ status: "error", error: error.message });
    }
})

router.post('/', async(req, res) => {
    try {
        if (!req.isAuthenticated || !req.sessions.account.username) {
            res.status(401).json({
                status: "error",
                error: "not logged in"
            })
        }
        const Comment = req.models.Comment;
        const { postID, newComment } = req.body;
        const loggedUser = req.session.account.username;

        const comment = new Comment({
            username: loggedUser,
            comment: newComment,
            post: postID,
            created_date: Date.now()
        })
        await comment.save();
        return res.json({ status: "success" });
    } catch(error) {
        console.error(error);
        return res.status(500).json({ status: "error", error: error.message });
    }
})
export default router;