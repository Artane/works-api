/**
 * Retrieve a standardized response object.
 * @param  {boolean} success If the client's request was successful or not
 * @param  {Object} message
 * @return {[type]}         [description]
 */
module.exports = function formatResponse(success, content) {

	// do a little typechecking on success to help ensure uniform responses
	if (typeof success !== 'boolean') {
		throw Error({ name: 'TypeError', message: 'This should be a boolean' });
	}

	return (success) ? { success, message: content } : { success, error: content } ;
}
