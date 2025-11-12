const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');

describe('auth routes smoke', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);

  test('signup missing fields', async () => {
    const res = await request(app).post('/api/auth/signup').send({});
    expect(res.statusCode).toBe(400);
  });
});
