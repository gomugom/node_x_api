const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const {renderLogin, regDomain} = require("../controllers");

router.get('/', renderLogin);
router.post('/domain', isLoggedIn, regDomain);

module.exports = router;