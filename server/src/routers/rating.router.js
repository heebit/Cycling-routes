const router = require('express').Router();
const { Rating, Route, User } = require('../../db/models');
const { verifyAccessToken } = require('../middleWares/verifyToken');

router.get('/', async (req, res) => {
  try {
    const rate = await Rating.findAll();
    res.json(rate);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const rate = await Rating.findAll({
      where: { routeId: id },
      include: { model: User, Route }
    });
    const data = rate.map((item) => item.get({ plain: true }));
    res.json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});



router.post('/:id', verifyAccessToken, async (req, res) => {
  const { rating, review } = req.body;
  const { user } = res.locals;
  const { id } = req.params;
  try {
    if (rating && review ) {
      const rate = await Rating.create({rating, review, userId: user.id, routeId: id });
      res.json(rate);
    } else {
      res.status(400).json({ message: 'не все поля заполнены' });
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});

router.delete('/:id', verifyAccessToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = res.locals;
    const rate = await Rating.findByPk(id);

    if (rate.userId === user.id)  {
      rate.destroy();
      res.sendStatus(200);
    } else {
      res.status(400).json({ message: 'Нет прав на удаление' });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.put('/:id', verifyAccessToken, async (req, res) => { 
    const { id } = req.params; 
    const { userId, routeId, rating, review } = req.body; 
    const { user } = res.locals; 
   
    if (userId !== user.id) { 
      return res.status(401).json({ message: 'У вас нет прав на редактирование товара' }); 
    } 
    try { 
      const rate = await Rating.findByPk(id); 
      if (!rate) { 
        return res.status(404).json({ message: 'rate нет' }); 
      } 
      await rate.update({ rating, review }); 
      res.json(rate); 
    } catch (error) { 
      console.error(error); 
      res.sendStatus(400); 
    } 
  }); 

module.exports = router;