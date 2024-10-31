const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Post = sequelize.define('Post', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    img: { // 게시글당 이미지 한개, 여러개 필요시 이미지 테이블 분리해 게시글 : 이미지 = 1 : N 관계 형성 필요
        type: DataTypes.STRING(200),
        allowNull: true, 
    }
}, {
    sequelize,
    timestamps: true,
    underscored: false,
    paranoid: false,
    modelName: 'Post',
    tableName: 'posts',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    // charset: 'utf8',
    // collate: 'utf8mb4_general_ci',
});

module.exports = Post;