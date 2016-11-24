var ArticleModel = require('../models/article.js');

/*
 * GET article page.
 */

exports.show = function(req, res, next) {
  if (!req.params.slug) return next(new Error('No article slug.'));
//   req.collections.articles.findOne({slug: req.params.slug}, function(error, article) {
//     if (error) return next(error);
//     if (!article.published) return res.send(401);
//     res.render('article', article);
//   });
  ArticleModel.findOne({ slug: req.params.slug }).exec().then(function (article) {
      if (!article.isPublish) return res.send(401);
      res.render("article", article);
  }).catch(function (err) {
      return next(err.message);
  });

};


/*
 * GET articles API.
 */

exports.list = function(req, res, next) {
//   req.collections.articles.find({}).toArray(function(error, articles) {
//     if (error) return next(error);
//     res.send({articles:articles});
//   });

    ArticleModel.find({}).count().exec().then(function (articles) { 
        res.send({ articles: articles });
    }).catch(function (err) { 
        return next(err.message);
    })   
};


/*
 * POST article API.
 */

exports.add = function(req, res, next) {
  if (!req.body.article) return next(new Error('No article payload.'));
  var article = req.body.article;
  article.isPublish = false;
//   req.collections.articles.insert(article, function(error, articleResponse) {
//     if (error) return next(error);
//     res.send(articleResponse);
//   });
  return article.save().return("文章保存成功");       
};


/*
 * PUT article API.
 */

exports.edit = function(req, res, next) {
  if (!req.params.id) return next(new Error('No article ID.'));
  req.collections.articles.updateById(req.params.id, {$set: req.body.article}, function(error, count) {
    if (error) return next(error);
    res.send({affectedCount: count});
  });
};

/*
 * DELETE article API.
 */

exports.del = function(req, res, next) {
  if (!req.params.id) return next(new Error('No article ID.'));
  req.collections.articles.removeById(req.params.id, function(error, count) {
    if (error) return next(error);
    res.send({affectedCount: count});
  });
};


/*
 * GET article POST page.
 */

exports.post = function(req, res, next) {
  if (!req.body.title)
  res.render('post');
};



/*
 * POST article POST page.
 */

exports.postArticle = function(req, res, next) {
  if (!req.body.title || !req.body.slug || !req.body.text ) {
    return res.render('post', {error: 'Fill title, slug and text.'});
  }
  var article = {
    title: req.body.title,
    slug: req.body.slug,
    text: req.body.text,
    published: false
  };
  req.collections.articles.insert(article, function(error, articleResponse) {
    if (error) return next(error);
    res.render('post', {error: 'Article was added. Publish it on Admin page.'});
  });
};



/*
 * GET admin page.
 */

exports.admin = function(req, res, next) {
  req.collections.articles.find({},{sort: {_id:-1}}).toArray(function(error, articles) {
    if (error) return next(error);
    res.render('admin',{articles:articles});
  });

}