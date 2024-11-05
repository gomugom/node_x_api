const express = require('express');
const {valifyAndShowTokenController, v1CreateTokenController} = require("../controllers/v1_test");
const router = express.Router();

router.post('/token', v1CreateTokenController);
router.get('/test_v1', valifyAndShowTokenController)

module.exports = router();