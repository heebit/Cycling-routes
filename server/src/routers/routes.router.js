const router = require("express").Router();
const { Route, User } = require("../../db/models");
const { verifyAccessToken } = require("../middleWares/verifyToken");

router.get("/", async (req, res) => {
  try {
    const route = await Route.findAll();
    res.json(route);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const route = await Route.findOne({
      where: { id },
      include: [{
        model: User,
        attributes: ['username'],
      }],
    });

    // Проверяем, существует ли запись
    if (!route) {
      return res.status(404).json({ message: 'Маршрут не найден' });
    }

    // Получаем данные и отправляем их
    const data = route.get({ plain: true });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.post("/", verifyAccessToken, async (req, res) => {
  const { title, distance, place, startPoint, endPoint } = req.body;
  const { user } = res.locals;
  try {
    if (title && distance && place) {
      const route = await Route.create({
        title,
        distance,
        place,
        startPoint,
        endPoint,
        userId: user.id,
      });
      res.json(route);
    } else {
      res.status(400).json({ message: "Не все поля заполнены" });
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});

router.delete("/:id", verifyAccessToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = res.locals;
    const route = await Route.findByPk(id);
    if (route.userId === user.id) {
      route.destroy();
      res.sendStatus(200);
    } else {
      res.status(400).json({ message: "Нет прав на удаление" });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.put("/:id", verifyAccessToken, async (req, res) => {
  const { id } = req.params;
  const { title, distance, place, startPoint, endPoint, userId } = req.body;
  const { user } = res.locals;

  if (userId !== user.id) {
    return res
      .status(401)
      .json({ message: "У вас нет прав на редактирование маршрута" });
  }
  try {
    const route = await Route.findByPk(id);
    if (!route) {
      return res.status(404).json({ message: " маршрут не найден" });
    }
    await route.update({ title, distance, place, startPoint, endPoint });
    res.json(route);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});

module.exports = router;
