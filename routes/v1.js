const express = require('express');
const {verifyToken} = require("../middlewares");
const {createToken, tokenTest, getMyPostsController, getPostsByHashtagController} = require("../controllers/v1");
const router = express.Router();

// /v1/token
router.post('/token', createToken);
// /v1/test
router.get('/test', verifyToken, tokenTest);

// GET /v1/posts/my => [ 내 게시글 제공 ]
router.get('/posts/my', verifyToken, getMyPostsController);

// GET /v1/posts/hashtag/:title => 해시태그를 사용하고 있는 게시글 조회
router.get('/posts/hashtag/:title', verifyToken, getPostsByHashtagController);

module.exports = router;