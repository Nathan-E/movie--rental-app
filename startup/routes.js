const express = require('express');
import {
  router as genreRouter
} from '../routes/genres';
import {
  router as customerRouter
} from '../routes/customers';
import movies from '../routes/movies';
import rentals from '../routes/rentals';
import users from '../routes/users';
import auth from '../routes/auth';
import error from '../middleware/error';
import bodyParser from 'body-parser';


export default function (app) {
  app.use(express.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
  app.use('/api/genres', genreRouter);
  app.use('/api/customers', customerRouter);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use(error);
}