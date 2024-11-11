const User = require('./user');
const Post = require('./post');
const HashTag = require('./hashtag');
const Domain = require('./domain');
const Follow = require('./follow');
const Sequelize = require('sequelize');
const db = require("./db");

// 모델을 불러와 sequelize에 등록

db.User = User;
db.Post = Post;
db.HashTag = HashTag;
db.Domain = Domain;
db.Follow = Follow;

// 관계 생성
// User : Post = 1: N
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

// 사용자 : 사용자 = N : M (팔로잉 관계)
db.User.belongsToMany(db.User, { // 팔로워
    foreignKey: 'followingId',
    as: 'Followers',
    through: db.Follow // 중간테이블
});

db.User.belongsToMany(db.User, { // 팔로잉
    foreignKey: 'followerId',
    as: 'Followings',
    through: db.Follow,
});

// Post : Hashtags = N : M
db.Post.belongsToMany(db.HashTag, {
    through: 'PostHashTag'
});

db.HashTag.belongsToMany(db.Post, {
    through: 'PostHashTag'
});

// User : Domain = 1 : N 관계 설정
db.User.hasMany(db.Domain);
db.Domain.belongsTo(db.User);

module.exports = db;