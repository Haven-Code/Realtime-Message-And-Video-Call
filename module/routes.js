const User = require("../schema/user");
var ObjectId = require('mongodb').ObjectID;

module.exports = (app, passport,io) => {

	app.get('/', (req, res) => {

		if (req.isAuthenticated()) {

			res.render("chatPage/index", { user: req.user });

		} else {
			res.redirect("/login.html");
		}

	})

	app.get('/login.html', (req, res) => {
		if (req.isAuthenticated()) {
			res.redirect("/");
		} else {
			res.render("loginPage/index", { message: req.flash('loginMessage') });
		}

	})

	app.post('/login.html',
		passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login.html'
		})
	);

	app.get('/logout', async function (req, res) {

		let user = req.user;

		let up = await User.findOneAndUpdate({
			username: user.username
		}, {
			is_online: 'false'
		})
		io.of('/user').emit('user-offline',user._id);
		req.logout();
		res.redirect('/');
	});

	app.get('/videoCall/:type/:userid', (req, res) => {
		res.render("callPage/videoCall",{ user: req.user , callTo: req.params.userid, typeCall: req.params.type});
	})
}