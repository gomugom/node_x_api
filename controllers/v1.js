const { User, Domain, Post, HashTag } = require('../models');
// const User = require('../models/user');
// const Domain = require('../models/domain');
// const Post = require('../models/post');
// const HashTag = require('../models/hashtag');
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
        }, process.env.JWT_SECRET, {
            expiresIn: '1m',
            issuer: 'node_x' // 발급자
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
            message: '서버 에러',
        });
    }
}

exports.tokenTest = (req, res, next) => {
    res.json(res.locals.decoded);
}

exports.getMyPostsController = async (req, res, next) => {

    try {

        const myPostList = await Post.findAll({
            where: {
                userId: res.locals.decoded?.id // verify 미들웨어에서 저장한 사용자 정보
            }
        });

        console.log(myPostList);

        return res.json({
            code: 200,
            payload: myPostList,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }

}

exports.getPostsByHashtagController = async (req, res, next) => {

    const hashtag = req.params.title;

    try {
        const searchedHashtag = await HashTag.findOne({
            where: {
                title: hashtag,
            }
        });

        if (!searchedHashtag) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다.'
            });
        }

        const posts = await searchedHashtag.getPosts();

        if(posts.length === 0) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다.',
            });
        }

        return res.json({
            code: 200,
            payloadType: posts,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }

}