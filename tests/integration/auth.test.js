const {
  User
} = require('../../models/user');
const {
  Genre
} = require('../../models/genre');
const request = require('supertest');
const mongoose = require('mongoose');

let app = require('../../index');
let server;

describe('auth middleware', () => {
  beforeEach(() => {
    server = app;
  })
  afterEach(async () => {
    server.close();
    await Genre.deleteMany({});
    // await     mongoose.connection.close();
  });

  let token;

  const exec = () => {
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({
        name: 'genre1'
      });
  }

  beforeEach(() => {
    token = (new User()).generateAuthToken();
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(server)
      .post('/api/genres')
      .send({
        name: 'genre1'
      });
    expect(response.status).toBe(401);
  }, 10000);

  it('should return 400 if token is invalid', async () => {
    const response = await request(server)
      .post('/api/genres')
      .set('x-auth-token', 'hello')
      .send({
        name: 'genre1'
      });
    expect(response.status).toBe(400);
  }, 10000);

  it('should return 200 if token is valid', async () => {

    const response = await request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({
        name: 'genre1'
      });
    expect(response.status).toBe(200);
  }, 10000);
});