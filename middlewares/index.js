const jwt = require('jsonwebtoken');

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