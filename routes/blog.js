var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('blog', { title: 'Blog Index' });
})


router.get('/list', function (req, res, next) {
    res.render('blog', { title: 'Blog List', names: ['张三', '李四', '王五'] });
})

module.exports = router;