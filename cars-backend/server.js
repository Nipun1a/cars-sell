const express = require('express');
require('dotenv').config();
const cors = require('cores');
const jsonParser = require('body-parser');
const jwt = require('jsonwebtoken');


const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors());
app.use(jsonParser.json());

//Define routes here
const userRoutes = require('./routes/userRoutes');

