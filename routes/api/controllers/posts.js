import express from 'express';

var router = express.Router();


router.get('/', async(req, res) => {
    try {
        const Post = req.models.Post;
        let posts;
        if (req.query.username) {
            posts = await Post.find({ username: req.query.username });
        } else {
            posts = await Post.find();
        }
        const postData = await Promise.all(
            posts.map(async (post) => {
                try {
                    const { username, title, post: postContent, hashtag, likes, created_date, _id } = post;
                    return {
                        username,
                        title,
                        post: postContent,
                        hashtag,
                        likes,
                        created_date,
                        id: _id
                    };
                } catch (error) {
                    return {
                        username: post.username,
                        title: post.title,
                        post: post.post,
                        hashtag: post.hashtag,
                        post: post.likes,
                        created_date: post.created_date,
                        id: post._id
                     };
                }
            })
        );
        res.json(postData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.post('/', async(req, res) => {
    if (!req.session.isAuthenticated) {
        res.status(401).json({
            status: "error",
            error: "not logged in"
        })
    }
    try {
        const currentTime = Date.now();
        const currentDate = new Date(currentTime);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        };
        const formattedDate = currentDate.toLocaleString('en-US', options);
        console.log(formattedDate)
        const newPost = new req.models.Post({
            username: req.session.account.username,
            title: req.body.title,
            post: req.body.post,
            hashtag: req.body.hashtag,
            created_date: formattedDate
        })
        await newPost.save()
        res.json({ status: 'success'});
    } catch(error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: error.message });
    }
});


// TODO: Make likes, unlike, comments work for when like is a Number/INT
// instead of an array of strings.

router.post('/like', async(req, res) => {
    try {
        if (!req.session.isAuthenticated) {
            res.status(401).json({
                status: "error",
                error: "not logged in"
            })
        }
            const Post = req.models.Post
            const postID = req.body.postID;
            const post = await Post.findById(postID);
            if (!post) {
                console.log("no post from user");
            }
            const loggedUser = req.session.account.username;
            if (!post.likes.includes(loggedUser)) {
                post.likes.push(loggedUser);
            }
            await post.save();
            res.json({ status: "success"});
    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: "error", error: error.message });
    }
})

router.post('/unlike', async(req, res) => {
    try {
        if (!req.session.isAuthenticated) {
            res.status(401).json({
                status: "error",
                error: "not logged in"
            })
        }
        const Post = req.models.Post
        const postID = req.body.postID;
        const post = await Post.findById(postID);
        if (!post) {
            console.log("no post from user");
        }
        const loggedUser = req.session.account.username;
        const index = post.likes.indexOf(loggedUser);
        if (index !== -1) {
            post.likes.splice(index, 1);
            await post.save();
        }
        res.json({ status: "success" });
    } catch(error) {
        console.error(error)
        return res.status(500).json({ status: "error", error: error.message });
    }
})

// TODO: To be implemented, users should probably only be able to delete their own posts
// from their userInfo page. Also should comments be left there and the post just becomes null?

/*
router.delete('/', async(req, res) => {
    try {
        if (!req.isAuthenticated || !req.sessions.account.username) {
            res.status(401).json({
                status: "error",
                error: "not logged in"
            })
        }
        const Post = req.models.Post;
        const { postID } = req.body
        const Comment = req.models.Comment;
        await Comment.deleteMany({ post: postID });
        await Post.deleteOne({ _id: postID });
        return res.json({ status: "success" });
    } catch(error) {
        console.error(error)
        return res.status(500).json({ status: "error", error: error.message });
    }
}) */
export default router;