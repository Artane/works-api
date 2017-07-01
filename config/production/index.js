module.exports = {
	"db": {
		"connectionInfo": {
			"host": "10.132.85.237",
			"port": 3306,
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
		"port": 8081,
		"passcode": "bleepbloop!"
	}
}
