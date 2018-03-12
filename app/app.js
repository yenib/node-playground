const express = require('express');
const config = require('../config')[process.env.NODE_ENV || "dev"];
const path = require('path');
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require('cors');

const subscriptionController = require("./controllers/subscriptionController");

const app = express();

// Application setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Routes
app.post("/subscribe", subscriptionController.subscribe);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  if (req.xhr) {
    res.status(err.status || 500).send({ error: err.message })
  } else {
    //res.render("error");
    res.status(err.status || 500).send({ error: err.message })
  }
});


var server = app.listen(config.port, function() {
  console.log('Listening on port ' + config.port);
});
