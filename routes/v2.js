const express = require('express');
const {createTokenController, getPostsByHashtagController, tokenTestController, getMyPostsController} = require("../controllers/v2");
const {verifyToken, apiLimiter, corsWhenDomainMatches} = require("../middlewares");
const {verify} = require("jsonwebtoken");
const router = express.Router();

// v2 router : API 요청 횟수 제한 미들웨어 적용(express-rate-limit)

router.use(corsWhenDomainMatches);

// POST /v2/token
router.post('/token', apiLimiter, createTokenController);

// GET /v2/test
router.get('/test', verifyToken, apiLimiter, tokenTestController);

// GET /v2/posts/my
router.get('/posts/my', verifyToken, apiLimiter, getMyPostsController);

// GET /v2/posts/hashtag/:title
router.get('/posts/hashtag/:title', verifyToken, apiLimiter, getPostsByHashtagController);

module.exports = router;