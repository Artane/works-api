module.exports = {
	"db": {
		"connectionInfo": {
			"host": "localhost",
			"port": 13000,
			"user": "root",
			"password": "HiyaThisIsAwesome",
			"database": "works"
		},
		"tableName": "Works",
		"model": {
			"create": require('../common/models/create.json'),
			"update": require('../common/models/update.json')
		},
		errors: require('../common/errors/db-errors.json')
	},
	"server": {
		"port": 13001,
		"passcode": "bleepbloop!"
	}
}
