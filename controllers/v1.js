const {Domain, User} = require("../models");
const jwt = require('jsonwebtoken');

exports.createToken = async (req, res, next) => {
    const { clientSecret } = req.body;
    try {
        const domain = await Domain.findOne({
            include: [
                {
                    model: User,
                    attributes: ['id', 'nick']
                }
            ],
            where: {
                clientSecret,
            }
        });

        if (!domain) {
            return res.status(401).json({
                code: 401,
                message: '등록되지 않은 도메인입니다. 도메인부터 등록하세요.'
            });
        }

        const token = jwt.sign({
            id: domain.User.id,
            nickname: domain.User.nick,
        }, procss.env.JWT_SECRET, {
            expiresIn: '1m',
            issue: 'node_x' // 발급자
        });

        return res.json({
            token,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
}

exports.tokenTest = (req, res, next) => {
    res.json(res.locals.decoded);
}