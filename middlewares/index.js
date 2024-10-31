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