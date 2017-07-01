const formatResponse = require('../lib/response-formatter.js');

module.exports = (passcode) => {
	return {
		// proceed with limited authorization
		check: (req, res, next) => {
			res.locals.superUser = false;
			if (req.headers['x-access-token'] === passcode) {
				res.locals.superUser = true;
				next();
			} else {
				next();
			}
		},
		// do not proceed if pass token incorrect
		only: (req, res, next) => {
			res.locals.superUser = false;
			if (req.headers['x-access-token'] === passcode) {
				res.locals.superUser = true;
				next();
			} else {
				res.status(403).send(formatResponse(false, 'Sorry, doesn\'t look like you are supposed to do that.'));
			}
		}
	};
}
