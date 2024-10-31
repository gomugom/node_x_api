const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Hashtag = sequelize.define('Hashtag', {
    title: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
    }
}, {
    sequelize,
    timestamps: true,
    underscored: false,
    paranoid: false,
    modelName: 'Hashtag',
    tableName: 'hashtags',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    // charset: 'utf8',
    // collate: 'utf8mb4_general_ci',
});

module.exports = Hashtag;