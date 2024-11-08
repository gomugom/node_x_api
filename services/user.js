const User = require('../models/user');

exports.follow = async (userId, followingId) => {
    try {

        const user = await User.findOne({
            where: {
                id: userId
            }
        });
        if (user) {
            await user.addFollowings(parseInt(followingId, 10));
            return 'ok';
        } else {
            return 'no user';
        }

    } catch (e) {
        throw new Error('DB 에러');
    }

}