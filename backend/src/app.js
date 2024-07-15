const express = require("express");
const app = express();
const dotenv = require('dotenv');

dotenv.config();
require('./startup/db')();
require('./startup/routes')(app);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}.`);
});

require('./startup/io')(server);




