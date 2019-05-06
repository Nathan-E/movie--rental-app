import 'babel-polyfill';
import request from 'supertest';
import {
  Movie
} from '../../models/movie';
import {
  Genre
} from '../../models/genre';
import mongoose from 'mongoose';
import _ from 'lodash';

import app from '../../index';

let server;

describe('api/movies', () => {

  beforeAll(() => {
    server = app;
  });
  afterEach(async () => {
    await Movie.deleteMany();
    await Genre.deleteMany();
  })
  afterAll(async () => {
    await Movie.deleteMany();
    await Genre.deleteMany();
  });
  describe('GET /', () => {
    it('should return all the movies', async () => {
      const movies = [{
          title: 'Punisher',
          genre: {
            _id: mongoose.Types.ObjectId(),
            name: 'Action'
          },
          numberInStock: 10,
          dailyRentalRate: 0
        },
        {
          title: 'Mr Bean',
          genre: {
            _id: mongoose.Types.ObjectId(),
            name: 'Comedy'
          },
          numberInStock: 10,
          dailyRentalRate: 0
        }
      ];

      await Movie.collection.insertMany(movies);

      const response = await request(server).get('/api/movies');
      expect(response.body.length).toBe(2);
      expect(response.status).toBe(200);
    });
  });
  describe('GET /:id', () => {
    it('should return all the movies', async () => {
      const movie = new Movie({
        title: 'Punisher',
        genre: {
          _id: mongoose.Types.ObjectId(),
          name: 'Action'
        },
        numberInStock: 10,
        dailyRentalRate: 0
      });

      await movie.save();

      const id = movie._id

      const response = await request(server)
        .get('/api/movies/' + id)
        .send();

      expect(response.status).toBe(200);
    });
    it('should return 404 if the id invalid', async () => {
      const id = 1

      const response = await request(server)
        .get('/api/movies/' + id)
        .send();

      expect(response.status).toBe(404);
    });
    it('should return 404 if the no movie has the given id', async () => {
      const id = mongoose.Types.ObjectId();

      const response = await request(server)
        .get('/api/movies/' + id)
        .send();

      expect(response.status).toBe(404);
    });
  });
  describe('POST /', () => {
    it('should return 400 if the request body contain invalid field', async () => {
      let movie = {
        title: 'Punisher',
        genreId: mongoose.Types.ObjectId(),
        numberInStock: 10,
        dailyRentalRate: 0,
      };

      const response = await request(server)
        .post('/api/movies')
        .send(movie);

      expect(response.status).toBe(400);
    });
    it('should return 400 if the request body contain any invalid field', async () => {
      let newGenre = new Genre({
        name: 'Action'
      });

      await newGenre.save();

      let movie = {
        title: '',
        genreId: newGenre._id,
        numberInStock: 10,
        dailyRentalRate: 0,
      };

      const response = await request(server)
        .post('/api/movies')
        .send(movie);

      expect(response.status).toBe(400);
    });
    it('should return all the movies', async () => {
      let newGenre = new Genre({
        name: 'Action'
      });

      await newGenre.save();

      let movie = {
        title: 'Punisher',
        genreId: newGenre._id,
        numberInStock: 10,
        dailyRentalRate: 0,
      };

      const response = await request(server)
        .post('/api/movies')
        .send(movie);

      expect(response.status).toBe(200);
    });
  });

  describe('PUT /:id', () => {
    it('should return 200 if the movie was updated successfully', async () => {
      let newGenre = new Genre({
        name: 'Action'
      });

      await newGenre.save();

      let movie = new Movie({
        title: 'Punisher',
        genre: _.pick(newGenre, ['_id', 'name']),
        numberInStock: 10,
        dailyRentalRate: 0,
      });

      await movie.save();

      const id = movie._id;
      const newTitle = 'Prison Break';

      const response = await request(server)
        .put('/api/movies/' + id)
        .send({
          title: newTitle,
          genreId: newGenre._id,
          numberInStock: 10,
          dailyRentalRate: 0,
        });

        expect(response.status).toBe(200);
    });
    it('should return 404 an invalid id was passed', async () => {
      let newGenre = new Genre({
        name: 'Action'
      });

      await newGenre.save();

      let movie = new Movie({
        title: 'Punisher',
        genre: _.pick(newGenre, ['_id', 'name']),
        numberInStock: 10,
        dailyRentalRate: 0,
      });

      await movie.save();

      const id = 1;
      const newTitle = 'Prison Break';

      const response = await request(server)
        .put('/api/movies/' + id)
        .send({
          title: newTitle,
          genreId: newGenre._id,
          numberInStock: 10,
          dailyRentalRate: 0,
        });

      expect(response.status).toBe(404);
    });
    it('should return 400 if the request body contains any invalid fields', async () => {
      let newGenre = new Genre({
        name: 'Action'
      });

      await newGenre.save();

      let movie = new Movie({
        title: 'Punisher',
        genre: _.pick(newGenre, ['_id', 'name']),
        numberInStock: 10,
        dailyRentalRate: 0,
      });

      await movie.save();

      const id = movie._id;

      const response = await request(server)
        .put('/api/movies/' + id)
        .send({
          title: '',
          genreId: newGenre._id,
          numberInStock: 10,
          dailyRentalRate: 0,
        });

      expect(response.status).toBe(400);
    });
    it('should return 400 if no genre with the given ID was found', async () => {
      let newGenre = new Genre({
        name: 'Action'
      });

      await newGenre.save();

      let movie = new Movie({
        title: 'Punisher',
        genre: _.pick(newGenre, ['_id', 'name']),
        numberInStock: 10,
        dailyRentalRate: 0,
      });

      await movie.save();

      const id = movie._id;
      const newTitle = 'Prison Break';

      const response = await request(server)
        .put('/api/movies/' + id)
        .send({
          title: newTitle,
          genreId: mongoose.Types.ObjectId(),
          numberInStock: 10,
          dailyRentalRate: 0,
        });

      expect(response.status).toBe(400);
    });
    it('should return 400 if no movie exists with the passed id', async () => {
      let newGenre = new Genre({
        name: 'Action'
      });

      await newGenre.save();

      let movie = new Movie({
        title: 'Punisher',
        genre: _.pick(newGenre, ['_id', 'name']),
        numberInStock: 10,
        dailyRentalRate: 0,
      });

      await movie.save();

      const id = mongoose.Types.ObjectId();
      const newTitle = 'Prison Break';

      const response = await request(server)
        .put('/api/movies/' + id)
        .send({
          title: newTitle,
          genreId: newGenre._id,
          numberInStock: 10,
          dailyRentalRate: 0,
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /:id', () => {
    it('should return 404 if there is no movie with the given Id', async () => {
      const id = mongoose.Types.ObjectId();

      const response = await request(server)
        .delete('/api/movies/' + id)
        .send();

      expect(response.status).toBe(404);
    });
    it('should return 404 if the given Id is invalid', async () => {
      const id = 1;

      const response = await request(server)
        .delete('/api/movies/' + id)
        .send();

      expect(response.status).toBe(404);
    });
    it('should delete the customer if it exist', async () => {
      let movie = new Movie({
        title: 'Punisher',
        genre: {id: mongoose.Types.ObjectId(), name: 'Action'},
        numberInStock: 10,
        dailyRentalRate: 0,
      });

      await movie.save();

      const id = movie._id;

      const response = await request(server)
        .delete('/api/movies/' + id)
        .send();

      expect(response.status).toBe(200);
    });
  });
});