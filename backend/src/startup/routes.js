const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const error = require('../middleware/error')

module.exports = function (app) {
	app.use(helmet());
	app.use(express.json());
	app.use(cookieParser());
	// other routes
	app.use(error);
};