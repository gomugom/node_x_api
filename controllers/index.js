const Domain = require('../models/domain');
const { v4: uuidv4 } = require('uuid');

exports.renderLogin = async (req, res, next) => {
    try {
        // passport deserialize에서 세팅한 정보를 통해 가져옴
        res.render('login', {
            user: req.user,
            domains: req.user?.Domains,
        });

    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.regDomain = async (req, res, next) => {
    try {
        await Domain.create({
           UserId: req.user.id,
            host: req.body.host,
            type: req.body.type,
            clientSecret: uuidv4(), // UUID 생성
        });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
}