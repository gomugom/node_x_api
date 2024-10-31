const passport = require('passport');
const { Strategy: KakaoStrategy } = require('passport-kakao');
const User = require('../../models/user');

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        // accessToken과 refreshToken은 카카오 API를 호출하는대 사용됨
        // 여기선 따로 사용하지 않을 것임
        // profile이 사용자 정보인대 매번 자주 바끼니 로그를 찍어 확인해보자.
        // const user = {
        //     id: profile.id,
        //     displayName: profile.displayName,
        //     contactemail: profile._json && profile._json.kakao_account.email,
        //     profileImage: profile._json && profile._json.properties.profile_image,
        // };
        try {

            console.log('kakao profile>>>');
            console.log(profile);

            const extUser = await User.findOne({
                where: {
                    snsId: profile.id, provider: 'kakao'
                }
            });

            if (extUser) { // 이미 사용자가 있는 경우
                done(null, extUser);
            } else {
                // 사용자가 없는 경우
                    // 로그인과 사용자 생성을 동시에 진행
                const newUser = await User.create({
                   email: profile._json && profile._json.kakao_account.email,
                   nick: profile.displayName,
                   provider: 'kakao',
                   snsId: profile.id,
                });

                console.log('insert user info');
                console.log(newUser);
                
                done(null, newUser); // 회원가입시키고 로그인 인증
            }

        } catch (error) {
            console.error(error);
            done(error);
        }

    }));
}