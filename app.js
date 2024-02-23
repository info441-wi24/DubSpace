import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

// import models from './models.js';
// import sessions from 'express-session';

// import usersRouter from './routes/users.js';

// import apiRouter from './routes/api/api.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// const oneDay = 1000 * 60 * 60 * 24
// app.use(sessions({
//   secret: "this is some secret key I am making up",
//   saveUninitialized: true,
//   cookie: {maxAge: oneDay},
//   resave: false
// }))

app.use((req, res, next) => {
  req.models = models
  next()
})

// app.use('/api', apiRouter);

export default app;
