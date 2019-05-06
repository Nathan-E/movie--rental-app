import 'babel-polyfill';
import {User} from '../../models/user';
import { Genre} from '../../models/genre';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../index';
let server;

describe('auth middleware', () => {
  beforeAll(() => {
    server = app;
  })
  afterEach(async () => {
    await Genre.deleteMany({});
  })
  afterAll(async () => {
    await Genre.deleteMany({});
  });

  let token;

  it('should return 401 if no token is provided', async () => {
    const response = await request(server)
      .post('/api/genres')
      .send({
        name: 'genre1'
      });
    expect(response.status).toBe(401);
  }, 50000);

  it('should return 400 if token is invalid', async () => {
    const response = await request(server)
      .post('/api/genres')
      .set('x-auth-token', 'hello')
      .send({
        name: 'genre1'
      });
    expect(response.status).toBe(400);
  }, 30000);

  it('should return 200 if token is valid', async () => {

    const response = await request(server)
      .post('/api/genres')
      .set('x-auth-token', (new User()).generateAuthToken())
      .send({
        name: 'genre1'
      });
    expect(response.status).toBe(200);
  }, 30000);
});