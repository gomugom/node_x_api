const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const { sequelize } = require('./models/db');
const dbConfig = require('./models');

const indexRouter = require('./routes');
const authRouter = require('./routes/auth');
const v1Router = require('./routes/v1');

const passport = require('passport');
const passportConfig = require('./config/passport/passport');

dotenv.config(); // process.env

const app = express();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
   express: app,
   watch: true,
});

app.use(morgan('dev')); // dev : 자세한 개발용 로그, combined : 상용 배포용(간단한 로그)

// static 정적 파일 설정
app.use(express.static(path.join(__dirname, 'public')));
// /img로 시작하는 요청이 있을 때 => ex) /img/file_name.jpg 로 => /__dirname path/uploads/file_name.jpg를 찾게 됨
// app.use('/img', express.static(path.join(__dirname, 'uploads')));

app.use(express.json()); // json 요청 허용
app.use(express.urlencoded({extended: false})); // form 요청 허용
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키 처리용
app.use(session({ // 기본은 메모리에 저장 -> 나중엔 Redis같은대 저장
   resave: false,
   saveUninitialized: false,
   secret: process.env.COOKIE_SECRET,
   cookie: {
      httpOnly: true,
      secure: false, // https 처리 적용하게 되면 true로 변경
   }
}));

// Passport 초기화 => 반드시 express-session 설정 밑에 와야함
app.use(passport.initialize()); // req.isAuthenticated, req.user, passport.authenticated 등을 생성해줌
app.use(passport.session()); // 세션에 저장되는 부분

passportConfig();

sequelize.sync({force: false, alter: true}).then(() => console.log('db connection success')).catch((err) => console.error('DB connection Fail'));

app.use('/', indexRouter);

// 회원가입, 로그인 처리용 라우터 분리
app.use('/auth', authRouter);

// v2 API router
app.use('/v1', v1Router);

// 404 not found
app.use((req, res, next) => {
   const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
   error.status = 404;
   next(error); // error처리 미들웨어로감
});

// error 처리용
app.use((err, req, res, next) => {
   // locals : 지역변수 저장 => pug, nunjucks 템플릿에서 변수로 받아오기 위해 사용
   res.locals.message = err.message;
   res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 상용에선 무슨 오류인지 알 수 없게
   // 에러 로그를 서비스한테 넘긴다.
   res.status(err.status || 500);
   res.render('error');
});

app.listen(app.get('port'), () => {
   console.log(`${app.get('port')} server is running...`);
});