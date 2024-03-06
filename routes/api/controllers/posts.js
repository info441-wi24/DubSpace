import express from 'express';

var router = express.Router();

// Endpoint for getting all posts
router.get('/', async(req, res) => {
  let username = req.query.username
  let search = req.query.search
  let tag = req.query.tag

  try {
    const Post = req.models.Post;
    let posts;
    if (username && !search && !tag) {
      posts = await Post.find({username: req.query.username});
    } else if (search && !username && !tag) {
      posts = await Post.find({post: {$regex: search, $options: 'i'}});
    } else if (tag && !username && !search) {
      posts = await Post.find({'hashtag.0': {$regex: tag, $options: 'i'}});
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
            created_date: post.created_date
          }
        }
      })
    );
    res.json(postData);
  } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', error: error.message });
  }
});

// Endpoint for adding new posts
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

// Endpoint for liking posts
router.post('/like', async(req, res) => {
    try {
        if (!req.session.isAuthenticated) {
            res.status(401).json({
                status: "error",
                error: "not logged in"
            })
        }
        const postID = req.body.postID;
        const currentUser = req.session.account.username;

        const post = await req.models.Post.findById(postID);

        if (!post.likes.includes(currentUser)) {
            post.likes.push(currentUser);
        } else {
            console.log("You've already liked this")
        }
            await post.save();
            res.json({ status: "success"});
    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: "error", error: error.message });
    }
})

// Endpoint for unliking posts
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

// Endpoint for getting specific post based on id
router.get('/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await req.models.Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: error.message });
    }
});

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