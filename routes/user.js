
/*
 * GET users listing.
 */

exports.list = function (req, res) {
  res.send('respond with a resource');
};


/*
 * GET login page.
 */

exports.login = function (req, res, next) {
  res.render('login');
};

/*
 * GET logout route.
 */

exports.logout = function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
};


/*
 * POST authenticate route.
 */

exports.authenticate = function (req, res, next) {
  if (!req.body.email || !req.body.password) { 
    return res.render('login', {
      error: '请输入邮箱和密码'
    });
  }
  req.collections.users.findOne({
    email: req.body.email,
    password: req.body.password
  }, function (error, user) {
    if (error) return next(error);
    if (!user) return res.render('login', {
      error: '不正确的邮箱密码组合'
    });
    req.session.user = user;
    req.session.admin = user.admin;
    res.redirect('/admin');
  })
};
