const express = require('express');
const config = require('../config');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

//LinkedIn auth
const request = require('request');

const subscriptionController = require('./controllers/subscriptionController');  

const app = express();

// Application setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(cors());


// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    inClientId: config.apis.linkedInClientId,
    csrfToken: csrfToken = 'WZEe5Wf45A6gykLLef424' // TODO: generate and store on session
  });
});

app.post('/subscribe', subscriptionController.subscribe);

app.get('/auth/in', (req, res, next) => {
  const csrfToken = 'WZEe5Wf45A6gykLLef424'; // TODO: get from session
  if(req.query.state !== csrfToken) {
    let err = new Error('Unauthorized'); // request was compromised
    err.status = 401;
    next(err);
    return;
  }

  if(req.query.error) {
    if(req.query.error.match(/cancel/i)) {
      res.status(200).json({ message: 'User cancelled.' });
      return;
    } else {
      console.log(req.query.error);
      let err = new Error('Internal Server Error');
      err.status = 500;
      next(err);
      return;
    }
  }

  getConnectionsFromLinkedIn(req.query.code, res, next);
});  

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  if (req.xhr) {
    res.status(err.status || 500).send({ errMessage: err.message });
  } else {
    //res.render("error");
    res.status(err.status || 500).send({ errMessage: err.message });
  }
});


var server = app.listen(config.app.port, function() {
  console.log('Listening on port ' + config.app.port);
});

function getConnectionsFromLinkedIn(authCode, res, next) {
  // Exchange Authorization Code for an Access Token
  const data = {
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: 'http://localhost:3000/auth/in',
    client_id: config.apis.linkedInClientId,
    client_secret: config.apis.linkedInClientSecret
  };
  request.post('https://www.linkedin.com/oauth/v2/accessToken', 
    {form: data}, 
    function (error, response, body) {
      console.log(body);
      const info = JSON.parse(body);
      if(error || !info.access_token) { 
        //error response.statusCode
        console.log(error);
        let err = new Error('Internal Server Error');
        err.status = 500;
        next(err);
        return;  
      }

      // Get connections
      const options = {
        url: 'https://api.linkedin.com/v2/connections?q=viewer&projection=(elements*(to~(id,localizedFirstName,localizedLastName,firstName,lastName,emailAddress)))',
        headers: {
          'Authorization': 'Bearer ' + info.access_token
        }
      };
      request(options, function (error, response2, body) {
        if (error || response2.statusCode != 200) {
          console.log(error);
          res.status(200).send(body);
          return;
        }
        const conns = JSON.parse(body);
        res.status(200).send({
          rawAuthRes: response,
          parsedAuthResponse: info,
          parsedConnRes: conns,
          rawConnRes: response2
        });
      });
    }); 
}