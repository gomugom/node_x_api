const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Follow = sequelize.define('Follow', {

}, {
    timestamp: true,
});

module.exports = Follow;