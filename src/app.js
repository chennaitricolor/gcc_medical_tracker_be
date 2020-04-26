const express = require('express');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

const redisClient = redis.createClient();
const compression = require('compression');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(compression());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
  name: 'gcc-medical-tracker',
  store: new RedisStore({ client: redisClient }),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

app.use(morgan(':date[iso] :method :url :status :res[content-length] - :response-time ms'));

app.use('/health', (req, res) => res.json({
  health: 'Good'
}));


app.use('/auth', routes.authRoute);
app.use('/form', routes.formRoute);
app.use('/dashboard', routes.dashboardRoute);

app.use((req, res) => res.sendStatus(404));

process.on('uncaughtException', (err) => {
  console.error(`uncaughtException :: ${err.stack}`);
});

process.on('unhandledRejection', (reason) => {
  console.error(`unhandledRejection :: ${reason.stack || reason}`);
});

module.exports = app;
