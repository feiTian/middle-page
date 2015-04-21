
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'Index' });
};

exports.login = function(req, res){
	console.log("login action");
	res.render('login', { title: '用户登陆'});
};

exports.logout = function(req, res){
	req.session.user=null;
	res.redirect('/');
};

exports.home = function(req, res){
	res.render('home', { title: 'Home'});
};
