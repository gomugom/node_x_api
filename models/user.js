const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: true,
    },
    nick: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    provider: {
        // ENUM => local(email로그인), kakao(카카오로그인)로 입력값 제한
        type: DataTypes.ENUM('local', 'kakao'),
        allowNull: false,
        defaultValue: 'local',
    },
    snsId: { // 카카오 로그인시 로그인ID 저장용
        type: DataTypes.STRING(30),
        allowNull: true,
    }
}, { // 옵션
    sequelize,
    timestamps: true, // createdAt, updatedAt 자동 생성
    underscored: false, // true로 설정시 created_at, updated_at처럼 컬럼명이 만들어짐
    modelName: "User", // javascript에서 쓰는 이름
    tableName: "Users", // MySQL DB 이름
    paranoid: true, // deletedAt이 자동생성됨
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    // charset: 'utf8',
    // collate: 'utf8mb4_general_ci' // 이모티콘까지 저장필요시 mb4붙여서 생성
});

module.exports = User;