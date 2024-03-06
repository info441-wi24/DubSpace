import express from 'express';

const router = express.Router();
// Router get endpoint
router.get('/', async (req, res) => {
    try {
        const Comment = req.models.Comment;
        const { postID } = req.query;
        const comments = await Comment.find({ post: postID });
        return res.json(comments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', error: error.message });
    }
});

// Router post endpoint for comments
router.post('/', async (req, res) => {
    try {
        if (!req.session.isAuthenticated) {
            return res.status(401).json({
                status: 'error',
                error: 'not logged in'
            });
        }

        const Comment = req.models.Comment;
        const { postID, newComment } = req.body;
        const loggedUser = req.session.account.username;

        const comment = new Comment({
            username: loggedUser,
            comment: newComment,
            post: postID,
            created_date: Date.now()
        });

        await comment.save();
        return res.json({ comment: comment  });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', error: error.message });
    }
});

export default router;