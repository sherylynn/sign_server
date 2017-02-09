var express = require('express'),
  http = require('http'),
  https = require('https'),
  fs = require('fs'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  multer = require('multer'),
  async = require('async'),
  routes = require('./routes/routes'),
  app = express(),
  showdown = require('showdown'),
  converter = new showdown.Converter(),
  PouchDB = require('pouchdb');


app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('md', function(path, options, fn) {
  fs.readFile(path, 'utf8', function(err, str) {
    if (err) return fn(err);
    //str = '<head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="/kankan/css/index.css" media="all" rel="stylesheet"></head><div id="all"' + converter.makeHtml(str) + '</div>';
    //str = '<head><style>#box{width:595;margin: auto}</style></head><div id="box">' + converter.makeHtml(str) + '</div>';
    str = '<head><link href="/kankan/css/index.css" media="all" rel="stylesheet" /></head><div id="all"' + converter.makeHtml(str) + '</div>';

    fn(null, str);
  });
});
app.use(favicon(__dirname + '/views/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
//为了防止user数据库出问题，用户数据用couchdb处理
app.use('/db', require('express-pouchdb')(PouchDB, {
  mode: 'minimumForPouchDB',
  overrideMode: {
    include: ['routes/fauxton']
  }
})); //目前版本非根目录下utils是不可以使用的，若根目录则kankan不能使用，会被db截取
var shit = new PouchDB('shit')

var server = http.createServer(app);
server.listen(app.get('port'));

server.on('listening', function() {
  console.log('----------listening on port: ' + app.get('port') + '----------------------');
});


server.on('error', function(error) {
  switch (error.code) {
    case 'EACCES':
      console.error(bind + '需要权限许可');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + '端口已被占用');
      process.exit(1);
      break;
    default:
      throw error;
  }
});


//加载路由
async.waterfall([
  function(callback) {
    routes(app);
    callback(null);
  },
  function() {
    /*
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });
    */

    if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('404/error', {
          message: err.message,
          error: err
        });
      });
    }

    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('404/error', {
        message: err.message,
        error: {}
      });
    });
  }
]);