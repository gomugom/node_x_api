const express = require('express');
const router = express.Router();
const { joinController, loginController, logoutController } = require('../controllers/auth');
const {isLoggedIn, isNotLoggedIn} = require("../middlewares");
const passport = require('passport');

// /auth/join(회원가입)
router.post('/join', isNotLoggedIn, joinController);
router.post('/login', isNotLoggedIn, loginController);
router.get('/logout', isLoggedIn, logoutController);

// /auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

// /auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
    successRedirect: '/', // 인증 성공시 리다이렉트할 경로
    failureRedirect: '/?error=카카오로그인실패', // 인증 실패시 리다이렉트할 경로
}));

// /auth/kakao -> 카카오톡로그인화면 -> /auth/kakao/callback

module.exports = router;