const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const users = require('../routes/users');
const test = require('../routes/test');
const error = require('../middleware/error');

module.exports = function (app) {
	app.use(helmet());
	app.use(express.json());
	app.use(cookieParser());

	app.use('/api/users', users)
	app.use('/api/test', test)
	// other routes
	app.use(error);
};