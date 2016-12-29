var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  fs = require('fs'),
  multer = require('multer'),
  mongoskin = require('mongoskin'),
  dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/blog',
  db = mongoskin.db(dbUrl, { safe: true }),
  collections = {
    articles: db.collection('articles'),
    users: db.collection('users')
  };

var upload = multer({ dest: 'uploads/' })
//引入Express.js中间件
var session = require('express-session'),
  logger = require('morgan'),
  errorHandler = require('errorhandler'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  favicon = require('serve-favicon'),
  methodOverride = require('method-override');

var app = express();
app.locals.appTitle = 'Fly de Space';
var createFolder = function (folder) {
  try {
    fs.accessSync(folder);
  } catch (e) {
    fs.mkdirSync(folder);
  }
};
var uploadFolder = './upload/';
createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
  },
  filename: function (req, file, cb) {
    // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })

// 单图上传
// app.post('/upload', upload.single('logo'), function(req, res, next){
//     var file = req.file;
//     res.send({ret_code: '0'});
// });

// 多图上传
app.post('/upload', upload.array('logo', 5), function (req, res, next) {
  res.send({ ret_msg: 'success' });
  return next();
});

//处理请求中的查询
app.use(function (req, res, next) {
  if (!collections.articles || !collections.users) return next(new Error("No collections."))
  req.collections = collections;
  return next();
});

//Express配置
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Express中间件配置
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser('123456'));
app.use(session({ secret: 'express is powerful' }));

app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

//用户认证中间件
app.use(function (req, res, next) {
  if (req.session && req.session.admin) {
    res.locals.admin = true;
  }
  next();
});

//权限管理
var authorize = function (req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  }
  else {
    return res.send(401);
  }
}

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

// Pages and routes
app.get('/', routes.index);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('/logout', routes.user.logout);
app.get('/admin', authorize);
app.get('/admin', routes.article.admin);
app.get('/post', authorize);
app.get('/post', routes.article.post);
app.get('/upload', authorize);
app.get('/upload', routes.article.upload);
//app.post('/upload', routes.article.uploadFile, authorize);
app.post('/post', authorize);
app.post('/post', routes.article.postArticle);
app.get('/articles/:slug', routes.article.show);

// REST API routes
app.all('/api', authorize);
app.get('/api/articles', routes.article.list);
app.post('/api/articles', routes.article.add);
app.put('/api/articles/:id', routes.article.edit);
app.del('/api/articles/:id', routes.article.del);



app.all('*', function (req, res) {
  res.send(404);
})

// http.createServer(app).listen(app.get('port'), function(){
// console.log('Express server listening on port ' + app.get('port'));
// });

var server = http.createServer(app);
var boot = function () {
  server.listen(app.get('port'), function () {
    console.info('Express server listening on port ' + app.get('port'));
  });
}
var shutdown = function () {
  server.close();
}
if (require.main === module) {
  boot();
} else {
  console.info('Running app as a module')
  exports.boot = boot;
  exports.shutdown = shutdown;
  exports.port = app.get('port');
}
