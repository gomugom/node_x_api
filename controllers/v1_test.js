const Domain = require('../models/domain');
const {User} = require("../models");

exports.v1CreateTokenController = async (req, res, next) => {
    const { clientSecretKey } = req.body;

    try {

        const domain = await Domain.findOne({
            include: [
                {
                    model: User,
                    attributes: ['id', 'nick'],
                }
            ],
            where: {
                clientSecretKey,
            }
        });

        if (!domain) {
            return res.status(401).json({
                code: 401,
                message: 'no domain exist',
            });
        }

        const payload = {userId: req.user.id};
        const options = {expiresIn: '1m'};

        const token = jwt.sign(payload, process.env.JWT_SECRET, options);

        return res.json({
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

exports.valifyAndShowTokenController = (req, res, next) => {
    return res.json(res.locals.decoded);
}