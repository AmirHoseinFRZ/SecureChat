const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const users = require('../routes/users');
const groups = require('../routes/groups');
const roles = require('../routes/roles');
const permissions = require('../routes/permissions');
const test = require('../routes/test');
const error = require('../middleware/error');

module.exports = function (app) {
	app.use(helmet());
	app.use(express.json());
	app.use(cookieParser());

	app.use('/api/users', users)
	app.use('/api/groups', groups)
	app.use('/api/roles', roles)
	app.use('/api/permissions', permissions)
	app.use('/api/test', test)
	// other routes
	app.use(error);
};