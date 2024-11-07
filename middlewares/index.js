const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const {Domain} = require("../models");

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { // passport에서 제공하는 메서드(로그인 유무 제공)
        next(); // 로그인 되어있으면 다음 라우터 실행
    } else {
        res.status(403).send('로그인 필요');
    }
}

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`); // layout.html에 error alert 판별 부문 호출됨
    }
}

exports.verifyToken = (req, res, next) => {
    try {
        res.locals.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET); // token은 헤더에서 조회
        next(); // 통과하면 다음 미들웨어로 진입
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.',
            });
        }

        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다.',
        });
    }
}

exports.v1VerifyTokenMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const decoded = jwt.verify(token,  process.env.JWT_SECRET);
        res.locals.decoded = decoded;
        next(); // controller 호출ㅉ
    } catch (err) {
        console.error(err);
        return res.json({
            code: 401,
            message: 'fail verify token',
        });
    }
}

exports.apiLimiter = (req, res, next) => {
    // const loginUserId = res.locals.decoded?.id;
    // loginUserId에 따라 api 허용량 다르게 설정 가능
    rateLimit({
        windowMs: 1 * 60 * 1000, // 1분
        max: 100, // 최대 100회 요청 허용
        handler: (req, res, next, options) => {
            res.status(options.statusCode).json({
                code: options.statusCode, // 기본값은 429
                message: '요청 한도를 초과하였습니다. 잠시 후 다시 시도해주세요.',
            });
        },
    })(req, res,  next); // 미들웨어 확장
}

// v1 router deprecated용 미들웨어
exports.deprecated = (req, res, next) => {
    return res.status(410).json({
        code: 410,
        message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
    });
}

exports.corsWhenDomainMatches = async (req, res, next) => {
    const domain = await Domain.findOne({
        where: { // req.get('헤더명') == req.headers.헤더명
            // origin 헤더에 요청자의 도메인 주소가 있음
            host: new URL(req.get('origin')).host
        }
    });

    if (domain) { // 동일 도메인은 cors 문제가 없기 때문에 굳이 등록할 필요가 없음
        // 등록된 도메인인 경우(cors 즉 교차 출처여도 허용하도록 함)
        const corsOptions = {
            origin: req.get('origin'), // 허용할 도메인
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용할 HTTP 메서드
            credentials: true, // 교차 출처 요청시 인증정보를 허용할지 유무
        };
        
        // 미들웨어 확장법
        // ===> 다른 API 미들웨어에서 req, res, next를 사용하기 위해 사용함
        cors(corsOptions)(req, res, next);

    } else { // 등록되지 않은 도메인 => cors처리가 안되있음으로 다른 도메인에서 요청이 오면 오류가 발생함
             // 동일 도메인 요청 => 통과함
        next();
    }
}


