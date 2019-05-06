const winston = require('winston');
import express from 'express';
import dotenv from 'dotenv';
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

dotenv.config();
const app = express();

const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
      title: 'API Auto Generated Documentation',
      version: '1.0.0',
      description: 'Test Express API with autogenerated swagger doc'
    },
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
import logging from './startup/logging';
import routes from './startup/routes';
import db  from './startup/db';
import config from './startup/config';
import validation from './startup/validation';

logging();
routes(app);
db();
config();
validation();

const port = process.env.PORT;

if(process.env.NODE_ENV !== 'test'){
  app.listen(port), () => winston.info(`Listening on port ${port}...`);
}

export default app;