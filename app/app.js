const express = require('express');
const config = require('../config')[process.env.NODE_ENV || "dev"];
const path = require('path');
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.all("*", (req, res) => {
  res.send("Hello");
});


var server = app.listen(config.port, function() {
  console.log('Listening on port ' + config.port);
});
