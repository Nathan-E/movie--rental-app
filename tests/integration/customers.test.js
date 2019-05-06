import 'babel-polyfill';
import request from 'supertest';
import mongoose from 'mongoose';
import {
  Customer
} from '../../models/customer';

import app from '../../index';
let server;

describe('api/customers', () => {

  beforeAll(() => {
    server = app;
  });
  afterEach(async () => {
    await Customer.deleteMany();
  })
  afterAll(async () => {
    await Customer.deleteMany();
  });
  describe('GET /', () => {
    it('should return all the customer', async () => {
      const customers = [{
        name: 'Moses',
        isGold: true,
        phone: '08030'
      }, {
        name: 'Grace',
        isGold: true,
        phone: '07030'
      }];

      await Customer.collection.insertMany(customers);

      const response = await request(server).get('/api/customers');
      expect(response.body.length).toBe(2);
      expect(response.status).toBe(200);
    }, 30000);
  });
  describe('POST /', () => {
    it('should return 400 if the customer\'s name is less than the required length', async () => {
      let customer = {
        name: 'Nnam',
        isGold: true,
        phone: '12345'
      }

      const response = await request(server)
        .post('/api/customers')
        .send(customer);

      expect(response.status).toBe(400);
    });
    it('should return 400 if the customer\'s phone is more than the required length', async () => {
      let customer = {
        name: 'Nnam',
        isGold: true,
        phone: new Array(52).join('1')
      }

      const response = await request(server)
        .post('/api/customers')
        .send(customer);

      expect(response.status).toBe(400);
    });
    it('should return 200 if the customer details are valid', async () => {
      let customer = {
        name: 'Nnamdi',
        isGold: true,
        phone: '12345'
      }

      const response = await request(server)
        .post('/api/customers')
        .send(customer);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', 'Nnamdi');

    });
  });

  describe('GET /:id', () => {
    it('should return a customer if valid id is passed', async () => {
      let customer = new Customer({
        name: 'Stanley',
        isGold: true,
        phone: '12345'
      });

      await customer.save();

      const id = customer._id;

      const response = await request(server)
        .get('/api/customers/' + id)
        .send();

      expect(response.status).toBe(200);
    }, 30000);

    it('should return 404 if an invalid id is passed', async () => {
      const res = await request(server).get('/api/customers/1');

      expect(res.status).toBe(404);
    }, 30000);

    it('should return 404 if no genre with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/customers/' + id);

      expect(res.status).toBe(404);
    }, 30000);
  });

  describe('PUT /:id', () => {
    it('should return 404 if there is no customer with the given Id', async () => {
      let customer = new Customer({
        name: 'Stanley',
        isGold: true,
        phone: '12345'
      });

      await customer.save();

      const id = mongoose.Types.ObjectId();
      const newName = 'Nlamdi';

      const response = await request(server)
        .put('/api/customers/' + id)
        .send({
          name: newName,
          isGold: customer.isGold,
          phone: customer.phone
        });

      expect(response.status).toBe(404);
    });
    it('should return 404 if the given Id is invalid', async () => {
      let customer = new Customer({
        name: 'Stanley',
        isGold: true,
        phone: '12345'
      });

      await customer.save();

      const id = 1;
      const newName = 'Nlamdi';

      const response = await request(server)
        .put('/api/customers/' + id)
        .send({
          name: newName,
          isGold: customer.isGold,
          phone: customer.phone
        });

      expect(response.status).toBe(404);
    });
    it('should return 400 if the name field in the customer request body is invalid', async () => {
      let customer = new Customer({
        name: 'Stanley',
        isGold: true,
        phone: '12345'
      });

      await customer.save();

      const id = customer._id;
      const newName = 'Nlam';

      const response = await request(server)
        .put('/api/customers/' + id)
        .send({
          name: newName,
          isGold: customer.isGold,
          phone: customer.phone
        });

      expect(response.status).toBe(400);
    });
    it('should update the customer if it is valid', async () => {
      let customer = new Customer({
        name: 'Stanley',
        isGold: true,
        phone: '12345'
      });

      await customer.save();

      const id = customer._id;
      const newName = 'Nlamdi';

      const response = await request(server)
        .put('/api/customers/' + id)
        .send({
          name: newName,
          isGold: customer.isGold,
          phone: customer.phone
        });

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', newName);
    });
  });
  describe('DELETE /:id', () => {
    it('should return 404 if there is no customer with the given Id', async () => {
      const id = mongoose.Types.ObjectId();

      const response = await request(server)
        .delete('/api/customers/' + id)
        .send();

      expect(response.status).toBe(404);
    });
    it('should return 404 if the given Id is invalid', async () => {
      const id = 1;

      const response = await request(server)
        .delete('/api/customers/' + id)
        .send();

      expect(response.status).toBe(404);
    });
    it('should delete the customer if it exist', async () => {
      let customer = new Customer({
        name: 'Stanley',
        isGold: true,
        phone: '12345'
      });

      await customer.save();

      const id = customer._id;

      const response = await request(server)
        .delete('/api/customers/' + id)
        .send();

      expect(response.status).toBe(200);
    });
  });
});