import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import models from './models.js';

import sessions from 'express-session';
import WebAppAuthProvider from 'msal-node-wrapper';

import apiRouter  from './routes/api.js';
import usersRouter from './routes/controllers/users.js';


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

app.use((req, res, next) => {
  req.models = models
  next()
})

app.use('/api', apiRouter);

// Auth

const authConfig = {
  // TODO: Change when actual auth is setup
  auth: {
      clientId: "a04dfb19-2fa7-4b01-98d6-ec676e18de6f",
      authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
      clientSecret: "7X08Q~xhUiUiYhH0WIs_8t~lMTYBEr.P2g0oAbmY",
      redirectUri: "localhost:3000/redirect", //note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"
  },
  system: {
      loggerOptions: {
          loggerCallback(loglevel, message, containsPii) {
              console.log(message);
          },
          piiLoggingEnabled: false,
          logLevel: 3,
      }
  }
};

const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
  secret: "this is some secret key I am making up v45v;lkjgdsal;nwqt49asglkn",
  saveUninitialized: true,
  cookie: {maxAge: oneDay},
  resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.use((req, res, next) =>{
  console.log("session info:", req.session)
  next();
})

app.use('/api/users', usersRouter);

app.get(
'/signin',
(req, res, next) => {
  return req.authContext.login({
    postLoginRedirectUri: "/", // redirect here after login
  })(req, res, next);
}
);

app.get(
'/signout',
(req, res, next) => {
  return req.authContext.logout({
    postLogoutRedirectUri: "/", // redirect here after logout
  })(req, res, next);
}
);

app.use(authProvider.interactionErrorHandler());

export default app;
