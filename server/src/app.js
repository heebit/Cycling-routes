require('dotenv').config();
const apiRouter = require('./routers/api.router');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');


const app = express();
const { PORT } = process.env;


const corsConfig = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'], 
  credentials: true,
};


app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/api', apiRouter);
app.use('*', (req, res) => {
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
