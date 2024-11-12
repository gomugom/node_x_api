const User = require('../models/user');
const {follow} = require("../services/user");

exports.follow = async (req, res, next) => {
  try {
    // ?a=3 => query, /path/:id => params, json => body
    const result = await follow(req.user.id,  req.params.id);

    if (result == 'ok') {
      res.send('success');
    } else if (result === 'no user') {
      res.status(404).send('no user');
    }

    // const user = await User.findOne({ where: { id: req.user.id } });
    // if (user) { // req.user.id가 followerId, req.params.id가 followingId
    //   await user.addFollowings(parseInt(req.params.id, 10));
    //   res.send('success');
    // } else {
    //   res.status(404).send('no user');
    // }
  } catch (error) {
    // console.error(error);
    next(error);
  }
};