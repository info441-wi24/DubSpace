import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import models from './models.js';

import sessions from 'express-session';
import WebAppAuthProvider from 'msal-node-wrapper';

import apiRouter from './routes/api/api.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const authConfig = {
  auth: {
    clientId: "2b385243-f5ed-4139-9947-e4f97558d29f", // nic's info
    authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    clientSecret: "tnJ8Q~GdlEnpPps6OaGT2ICEEqx4TlsJf0tBraX4",
    redirectUri: "http://localhost:3000/redirect", //note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.enable('trust proxy')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.models = models
  next()
})

const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
  secret: "this is some secret key I am making up v45v;lkjgdsal;nwqt49asglkn",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.use((req, res, next) => {
  console.log("session info:", req.session)
  next();
})

app.use('/api', apiRouter);

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
