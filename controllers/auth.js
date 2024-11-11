const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const {login} = require("passport/lib/http/request");

// 회원가입 라우터
exports.joinController = async (req, res, next) => {

    const { nick, email, password } = req.body; // express.urlencoded, express.json을 통해 받아올 수 있게 됨

    // 기가입자 확인
    const existUser = await User.findOne({
        where: {
            email
        }
    });

    if (existUser) { // 기가입 사용자
        // 가입페이지로 리다이렉트(302)
        return res.redirect(`/join?error=${email}`);
    }

    // 사용자 생성
    const hashedPassword = await bcrypt.hash(password, 12);

    try {

        User.create({
            email,
            nick,
            password: hashedPassword // 암호화 필요
        });

    } catch (err) {
        console.error(err);
        next(err); // 에러처리 미들웨어로 분기
    }

    // 생성까지 완료됐으면 다시 로그인할 수 있도록 메인으로 이동
    return res.redirect('/');

}

// 로그인 컨트롤러
exports.loginController = (req, res, next) => {
    // authenticate의 첫번째 인자가 strategy 이름
    passport.authenticate('local', (authError, user, info) => {
        // strategy에서 done호출시 일로 이동됨
        if (authError) { // server error
            console.error(authError);
            next(authError); // 에러처리 미들웨어로 이동
        }
        if (!user) { // 로직실패
            return res.redirect(`/?loginError=${info.message}`); // layout.html에서 alert 발생
        }

        req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
        // req.login();
    })(req,  res, next); // 내 미들웨어 안에 미들웨어를 등록하는 미들웨어 확장시 (req, res, next)를 한번 더 붙인다.
}

exports.logoutController = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
        // res.redirect('/');
    });
}