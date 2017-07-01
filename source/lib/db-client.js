'use strict';
const mysql = require('mysql');

let connection;

class DBClient {
    constructor(config) {
        if (!connection) {
			this.DbConfig = config;
			this.DbError = config.errors;
            connection = mysql.createConnection(this.DbConfig.connectionInfo);
        }
    }

    get(filter) {
        return new Promise((res, rej) => {
            connection.connect(() => {
                let params = [];
                for (const param in filter) {
                    params.push(`${param} LIKE '%${filter[param]}%'`);
                }

                const queryString = params.length > 0 ?
									`SELECT * FROM ${this.DbConfig.tableName} WHERE ${params.join(' AND ')}`:
									`SELECT * FROM ${this.DbConfig.tableName}`;

                connection.query(queryString, (error, rows) => !error ? res(rows) : rej(error));
            });
        });
    }

	create(newObject) {
		return new Promise((res, rej) => {
			if (Object.keys(newObject).length > 0) {
				const errors = getErrors(newObject, this.DbConfig.model.create);
				if (Object.keys(errors).length) {
					rej({
						name: this.DbError.InvalidObject,
						message: errors
					});
				} else {
					connection.connect(() => {
						const keys = Object.keys(newObject);
						const values = getValues(newObject).map((value) => isNaN(value) ? `"${value}"` : value);
						const queryString = `INSERT INTO ${this.DbConfig.tableName} (${keys}) VALUES (${values})`;
						connection.query(queryString, (error, rows) => {
							if (!error && rows.affectedRows) {
								res({ id: rows.insertId })
							} else if (error.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
								rej({ name: this.DbError.Connection, message: 'There was an error connecting to the database! Sorry bout that :()' });
							} else {
								rej({ name: this.DbError.Unknown, message: error });
							}
						});
					});
				}
			} else {
				rej({ name: this.DbError.InvalidObject, message: 'Please provide some fields for entry to the database.' });
			}
		});
	}

	modify(id, modifiedObject) {
		return new Promise((res, rej) => {
			const keys = Object.keys(modifiedObject);
			if (keys.length > 0) {
				const errors = getErrors(modifiedObject, this.DbConfig.model.update);
				if (Object.keys(errors).length) {
					const invalidObjectError = Object.assign({}, this.DbError.InvalidObject, { details: errors });
					rej(invalidObjectError);
				} else {
					connection.connect(() => {
						const values = getValues(modifiedObject).map((value) => isNaN(value) ? `"${value}"` : value);
						const queryString =	`UPDATE ${this.DbConfig.tableName} SET ${keys.map((key, i) => `${key}=${values[i]}`)} WHERE id=${id}`;
						connection.query(queryString, (error, rows) => {
							if (!error && rows.changedRows) {
								res({ id, found: true, modified: true });
							} else if (!error && rows.insertId !== id) {
								rej(this.DbError.NotFound);
							} else if (!error && !rows.changedRows) {
								res({ id, found: false, modified: false });
							} else if (error.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
								rej(this.DbError.Connection);
							} else {
								rej(this.DbError.Unknown);
							}
						});
					});
				}
			} else {
				rej(this.DbError.EmptyObject);
			}
		});
	}
}

function getErrors(obj, schema) {
	let errors = {};
	for (const field in obj) {
		if (typeof obj[field] !== schema[field]) {
			const notDefinedError = `'${field}' should not exist`;
			const invalidTypeError = `'${field}' should be of type '${schema[field]}', is '${typeof obj[field]}'`;
			errors[`${field}`] = schema[field] === undefined ? notDefinedError : invalidTypeError;
		}
	}

	return errors;
}

function getValues(obj) {
	const values = [];
	for (const field in obj) {
		values.push(obj[field]);
	}

	return values;
}

module.exports = DBClient;
