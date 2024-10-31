/* [ passport 관련 설정 ] */

const passport = require('passport');
const localStrategy = require('./localStrategy');
const kakaoStrategy = require('./kakaoStrategy');
const User = require('../../models/user');
const {Domain} = require("../../models");


/*
* [ passport 로그인 흐름(FLOW) ]
* 1. /auth/login 라우터를 통해 로그인 요청이 들어옴.
* 2. 라우터에서 passport.authenticate 메서드 호출
* 3. passport.authenticate가 로그인 전략(LocalStrategy) 수행
*   - 사용자 로그인해줘도 되는지 유무 판별(패스워드 검사 등...)
* 4. 로그인 인증 성공시(strategy에서 done호출) 사용자 정보 객체와 함께 passport.authenticate의 콜백함수가 실행되고
*    그 안에서 req.login() 호출
* 5. req.login 메서드가 passport.serializeUser 호출(req.session에 user.id 저장)
* 6. req.session에 사용자 아이디만 저장해서 세션 생성
*   - app.use(passport.session()) 부분에서 세션에 저장됨
* 7. express-session에 설정된 대로 브라우저에 connect.sid 세션 쿠키 전송
*   connect.sid라는 이름으로 세션 쿠키가 브라우저로 전송
* 8. 로그인 완료
* 
* [ 로그인 이후 과정 ]
* 1. 모든 요청에 passport.session() 미들웨어가 passport.deserializeUser() 메서드를 매번 호출
* 2. deserializeUser에서 req.session에 저장된 아이디로 데이터베이스에서 사용자 조회
* 3. 조회된 사용자 전체 정보를 req.user 객체에 저장
* 4. 라우터에서 req.user를 공용적으로 사용 가능하게 됨
* */

module.exports = () => {

    // Passport Local 전략 설정 등록
    localStrategy();

    // kakao strategy 등록
    kakaoStrategy();

    // 사용자 직렬화/역직렬화
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // 로그인 사용자 요청할 때 필요(로그인 후 사용자 정보 찾을 때)
    passport.deserializeUser((id, done) => {
       User.findOne({
           include: [
               {
                   model: User,
                   as: 'Followings',
                   attributes: ['id', 'nick'],
               },
               {
                   model: User,
                   as: 'Followers',
                   attributes: ['id', 'nick'],
               },
               {
                   model: Domain
               }
           ],
           where: {
               id,
           }
       }).then((user) => {
           done(null, user); // 이게 req.user가 됨
           // 로그인 후 req.user를 통해 로그인한 사용자 정보 조회가능
       }).catch((err) => {
           done(err);
       })
    });

}