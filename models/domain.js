const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Domain = sequelize.define('Domain', {
    host: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    type: {
        // 무료, 유료 고객
        type: DataTypes.ENUM('free', 'premium'),
        allowNull: false
    },
    clientSecret: { // API 서버 허용을 위한 고객키발급용
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: true,
    underscored: false,
    paranoid: true, // 지워진 도매인 복구를 위함
    modelName: 'Domain',
    tableName: 'Domains',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
});

module.exports = Domain;