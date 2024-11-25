const router = require('express').Router();
const { User } = require('../../db/models');
const { refresh } = require('../configs/cookiesConfig');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!(username && email && password)) {
      return res.status(400).json({ message: 'Все поля должны быть заполнены.' });
    }
    const [user, isCreated] = await User.findOrCreate({
      where: { email },
      defaults: { email, username, password: await bcrypt.hash(password, 10) },
    });

    if (!isCreated) {
      return res
        .status(400)
        .json({ message: `Пользователь с почтой ${email} уже существует.` });
    }

    const plainUser = user.get({ plain: true });
    delete plainUser.password;

    const { accessToken, refreshToken } = generateToken({ user: plainUser });

    res
      .cookie('refreshToken', refreshToken, refresh)
      .json({ user: plainUser, accessToken });
    res.end();
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({ message: 'Все поля должны быть заполнены.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        message: `Пользователь с почтой ${email} не найден.`,
      });
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(401).json({
        message: `Неверный пароль.`,
      });
    }

    const plainUser = user.get({ plain: true });
    delete plainUser.password;
    const { accessToken, refreshToken } = generateToken({ user: plainUser });
    res
      .cookie('refreshToken', refreshToken, refresh)
      .json({ user: plainUser, accessToken });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get('/signout', async (req, res) => {
  try {
    res.clearCookie('refreshToken').sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
