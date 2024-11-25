const { verifyRefreshToken } = require('../middleWares/verifyToken');
const generateToken = require('../utils/generateToken');
const { refresh } = require('../configs/cookiesConfig');

const router = require('express').Router();

router.get('/refresh', verifyRefreshToken, async (req, res) => {
  const { accessToken, refreshToken } = generateToken({
    user: res.locals.user,
  });
  res
    .cookie('refreshToken', refreshToken, refresh)
    .json({ user: res.locals.user, accessToken });
});

module.exports = router;
