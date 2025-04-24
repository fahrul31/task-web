const express = require('express')
const logger = require('./middleware/logger');
const router = require('./routes/index.js');
const app = express();

app.use(express.json());

app.use(logger);

app.use("", router);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})