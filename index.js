require('dotenv/config');

const express = require('express');
const app = express();

const routes = require('./routes/routes.js');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const PORT = process.env.SERVER_PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server is up ${PORT}`);
})