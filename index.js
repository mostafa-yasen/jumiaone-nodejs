const config = require('./config/config.json');
const express = require('express');
const bodyParser = require('body-parser');
const InitControllers = require('./app/InitControllers');
const logger = require('./services/logger');

const path = require('path');

var app = express();

require('./middlewares')(app);
app.use(bodyParser.json());

app.engine('pug', require('pug').__express)
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug')

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/public/js'));

app.use(express.static(__dirname + 'public'));

var _resolve;
var readyPromise = new Promise((resolve) => {
  _resolve = resolve
});

const contr = new InitControllers();
contr.init(app);

const server = require('http').createServer(app);
server.listen(config.serverPort, function () {
  logger.info('> Listening at http://localhost:' + config.serverPort + '\n');
  _resolve()
});


module.exports = {
  app: app,
  ready: readyPromise,
  close: (done) => {
    server.close(done)
  }
}
