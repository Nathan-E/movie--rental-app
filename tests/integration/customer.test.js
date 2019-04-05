const request = require('supertest');
const mongoose = require('mongoose');
const {
  Customer
} = require('../../models/customer');

let app = require('../../index');
let server;

describe('api/customers', () => {

  beforeEach(()=>{
    server = app;
  })
  afterEach(async () => {
    server.close();
    await Customer.deleteMany({});

    // await mongoose.connection.close();
  });
  describe('GET /', () => {
    it('should return all the customer', async () => {
      const customers = [{
        name: 'Moses',
        isGold: true,
        phone: '0803'
      }, {
        name: 'Grace',
        isGold: true,
        phone: '0703'
      }];

      await Customer.collection.insertMany(customers);

      const response = await request(server).get('/api/customers');
      expect(response.body.length).toBe(2);
      expect(response.status).toBe(200);
    }, 10000);
  });
});