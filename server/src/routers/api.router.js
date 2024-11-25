const router = require("express").Router();
const authRouter = require('./auth.router');
const tokenRouter = require('./token.router');
const routesRouter = require('./routes.router');
const  ratingRouter = require('./rating.router');


router.use('/auth', authRouter);
router.use('/tokens', tokenRouter);
router.use('/routes', routesRouter);
router.use('/rating', ratingRouter);


module.exports = router;
