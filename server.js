const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const bodyParser = require('body-parser');
const path = require("path");
const moment = require('moment-timezone');
const nodemailer = require('nodemailer'); // ייבא את הספריה
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine","ejs");
let db_M = require('./database');
global.db_pool = db_M.pool;
const port = 5353;
app.use(express.json());
app.listen(port, () => {
  console.log(`Now listening on port http://localhost:${port}`);
});
const coffee =require('./routes/coffee');
app.use('/coffee',coffee);

