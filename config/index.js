switch (process.env.NODE_ENV) {
	case 'dev':
		module.exports = require('./development');
		return;
	case 'mini-prod':
		module.exports = require('./mini-production');
		return;
	case 'prod':
	default:
		module.exports = require('./production');
}
