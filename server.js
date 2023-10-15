
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require("path");
app.use(express.static(path.join(__dirname)));
var db_M = require('./database');
global.db_pool = db_M.pool;
const port = 5353;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Now listening on port http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});
app.get("/data", (req, res) => {
  // let q = 'SELECT * FROM data';
  let q = `SELECT *, DATE_FORMAT(date, '%Y-%m-%d') AS FormattedDate FROM \`data\``;
  db_pool.query(q, function (err, rows, fields) {
    if (err) {
      res.status(500).json({message: err})
    } else {
      res.status(200).json({rows: rows});
    }
  });
});
app.post("/add", (req, res) => {
  let name = req.body.name;
  let choice = req.body.choice;
  let now = new Date();
  const date = now.toISOString().slice(0, 10); // משיג תאריך בפורמט "YYYY-MM-DD"
  let time = now.toLocaleTimeString();
  let Query = "INSERT INTO data";
  Query += " (name,choice, date, time)";
  Query += " VALUES (";
  Query += ` '${name}', '${choice}', '${date}', '${time}')`;
  console.log("adding task",Query);
  db_pool.query(Query, function (err, rows, fields) {

    if (err) {
      res.status(500).json({message: err})
    } else {
      res.status(200).json({message: "OK"});
    }
  });
});