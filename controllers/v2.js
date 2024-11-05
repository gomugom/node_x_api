const jwt = require('jsonwebtoken');
const {Domain, User, Post} = require("../models");

exports.createTokenController = async (req, res, next) => {

    const { clientSecret } = req.body;
    try {
        const domain = await Domain.findOne({
            where: { clientSecret },
            include: [
                {
                    model: User,
                    attributes: ['nick', 'id'],
                }
            ],
        });

        if (!domain) {
            return res.status(401).json({
                code: 401,
                message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
            });
        }

        const token = jwt.sign({
            id: domain.User.id,
            nick: domain.User.nick,
        }, process.env.JWT_SECRET, {
            expiresIn: '30m', // 30분
            issuer: 'node_x',
        });

        return res.json({
            code: 200,
            message: '토큰이 발급되었습니다.',
            token,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: 'server error',
        });
    }

}

exports.tokenTestController = (req, res, next) => {
    res.json(res.locals.decoded);
}

exports.getMyPostsController = (req, res, next) => {
    Post.findAll({ where: { userId: res.locals.decoded.id } })
        .then((posts) => {
            console.log(posts);
            res.json({
                code: 200,
                payload: posts,
            });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                code: 500,
                message: '서버 에러',
            });
        });
}

exports.getPostsByHashtagController = async (req, res, next) => {
    try {
        const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
        if (!hashtag) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다',
            });
        }
        const posts = await hashtag.getPosts();
        return res.json({
            code: 200,
            payload: posts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
}