'use strict';

const Express = require('express');
const router = Express.Router();

const Config = require('../config');

const EnvConfig = Config.server;

const DbConfig = Config.db;
const DbErrors = DbConfig.errors;
const DBClient = require('./lib/db-client.js');
const db = new DBClient(DbConfig);

const formatResponse = require('./lib/response-formatter.js');

const auth = require('./middleware/authenticate.js')(EnvConfig.passcode);

router.get('/:id', auth.check, (req, res) => _get(res, req.params));
router.get('/', auth.check, (req, res) => _get(res, req.query));

function _get(res, filter) {
	filter.display ? delete filter.display : null; // Don't let the user filter by display status
	db.get(Object.assign(res.locals.superUser ? {} : { display: 1 }, filter)).then((dbResponse) => {
      res.send(formatResponse(true, dbResponse));
  }).catch((error) => {
      res.status(getErrorCode(error)).send(formatResponse(false, error));
  });
}

router.post('/', auth.only, (req, res) => {
	db.create(req.body).then((dbResponse) => {
		res.status(201).send(formatResponse(true, dbResponse));
	}).catch((error) => {
		res.status(getErrorCode(error)).send(formatResponse(false, error));
	});
});

router.put('/:id', auth.only, (req, res) => {
	db.modify(req.params.id, req.body).then((dbResponse) => {
		res.send(formatResponse(true, dbResponse));
	}).catch((error) => {
		res.status(getErrorCode(error)).send(formatResponse(false, error));
	});
});

/**
 * Get an apropriate status code given an error object
 * @param  {DBError} error error for whom a status code is required
 * @return {integer} An integer http status code
 */
function getErrorCode(error) {
	switch (error) {
		case (DbErrors.InvalidObject):
		case (DbErrors.EmptyObject):
			return 400;
		case (DbErrors.NotFound):
			return 404;
		case (DbErrors.Connection):
			return 503;
	}

	return 500;
}

module.exports = router;
