const express = require('express');
const {createTokenController, getPostsByHashtagController, tokenTestController, getMyPostsController} = require("../controllers/v2");
const {verifyToken, apiLimiter} = require("../middlewares");
const {verify} = require("jsonwebtoken");
const router = express.Router();

// v2 router : API 요청 횟수 제한 미들웨어 적용(express-rate-limit)

// POST /v2/token
router.post('/token', apiLimiter, createTokenController);

// GET /v2/test
router.get('/test', apiLimiter, verifyToken, tokenTestController);

// GET /v2/posts/my
router.get('/posts/my', apiLimiter, verifyToken, getMyPostsController);

// GET /v2/posts/hashtag/:title
router.get('/posts/hashtag/:title', apiLimiter, verifyToken, getPostsByHashtagController);

module.exports = router;