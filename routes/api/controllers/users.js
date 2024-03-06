import express from 'express';

var router = express.Router();
// Endpoint for auth
router.get('/myIdentity', (req, res, next) => {
    if (req.session.isAuthenticated) {
        res.json({
            status: "loggedin",
            userInfo: {
                name: req.session.account.name,
                username: req.session.account.username
            }
        })
    } else {
        res.json({
            status: "loggedout"
        })
    }
});

export default router;