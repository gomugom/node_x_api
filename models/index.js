const User = require('./user');
const Post = require('./post');
const HashTag = require('./hashtag');
const Domain = require('./domain');
const {sequelize} = require("./db");

// 관계 생성
// User : Post = 1: N
User.hasMany(Post);
Post.belongsTo(User);

// 사용자 : 사용자 = N : M (팔로잉 관계)
User.belongsToMany(User, { // 팔로워
    foreignKey: 'followingId',
    as: 'Followers',
    through: 'Follow' // 중간테이블
});

User.belongsToMany(User, { // 팔로잉
    foreignKey: 'followerId',
    as: 'Followings',
    through: 'Follow',
});

// Post : Hashtags = N : M
Post.belongsToMany(HashTag, {
    through: 'PostHashTag'
});

HashTag.belongsToMany(Post, {
    through: 'PostHashTag'
});

// User : Domain = 1 : N 관계 설정
User.hasMany(Domain);
Domain.belongsTo(User);

module.exports = {
    User,  Post,  HashTag, Domain, sequelize
}