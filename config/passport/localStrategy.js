const { Strategy: LocalStrategy } = require('passport-local');
const passport = require("passport");
const User = require("../../models/user");
const bcrypt = require('bcrypt');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email', // req.body.email
        passwordField: 'password', // req.body.password
        passReqToCallback: false,
    }, async (email, password, done) => {
        // 로그인 시켜도 되는지 판단
        try {
            // 사용자 존재 유무 확인
            const extUser = await User.findOne({
                where: {email}
            });

            if (extUser) {
                // bcrypt의 compare를 통해 평문과 암호문의 일치여부를 비교할 수 있다.
                const result = await bcrypt.compare(password, extUser.password);
                if (result) { // pwd 일치
                    // done(서버실패, 성공유저, 로직실패)
                    // - 서버실패 : DB실패하거나 문법오류 등...(시스템 오류)
                    // - 성공유저 : 로그인 성공시 사용자 정보
                    // - 로직실패 : 패스워드 불일치, 권한없음 등 로그인시키면 안되는 경우(객체로 안되는 이유)
                    // => done이 호출되면 authenticate의 콜백함수로 이동
                    done(null, extUser);
                } else { // 로직실패 : 패스워드 불일치, 권한없음등 로그인시키면 안되는 경우
                    done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
                }
            } else {
                done(null, false, {message: '가입되지 않은 사용자입니다.'});
            }
        } catch (err) {
            console.error(err);
            done(err); // 서버실패 전달
        }
    }));
}