const request = require('supertest');
const app = require('../app');
const { connectTestDB, closeTestDB, clearTestDB } = require('./setup');

const API = '/api/v1';

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe('Auth API', () => {
  const userPayload = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123',
  };

  describe('POST /auth/register', () => {
    it('should register a new user and return 201 with a token', async () => {
      const res = await request(app).post(`${API}/auth/register`).send(userPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(userPayload.email);
      expect(res.body.data.user.password).toBeUndefined();
      expect(res.body.data.token).toEqual(expect.any(String));
    });

    it('should return 400 for invalid payload (missing password)', async () => {
      const res = await request(app)
        .post(`${API}/auth/register`)
        .send({ name: 'Jane', email: 'jane@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 409 when email already exists', async () => {
      await request(app).post(`${API}/auth/register`).send(userPayload);
      const res = await request(app).post(`${API}/auth/register`).send(userPayload);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app).post(`${API}/auth/register`).send(userPayload);
    });

    it('should log in successfully with correct credentials', async () => {
      const res = await request(app).post(`${API}/auth/login`).send({
        email: userPayload.email,
        password: userPayload.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toEqual(expect.any(String));
    });

    it('should return 401 for incorrect password', async () => {
      const res = await request(app).post(`${API}/auth/login`).send({
        email: userPayload.email,
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /auth/me', () => {
    it('should return 401 when no token is provided', async () => {
      const res = await request(app).get(`${API}/auth/me`);
      expect(res.status).toBe(401);
    });

    it('should return the current user profile with a valid token', async () => {
      const registerRes = await request(app).post(`${API}/auth/register`).send(userPayload);
      const { token } = registerRes.body.data;

      const res = await request(app).get(`${API}/auth/me`).set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe(userPayload.email);
    });
  });
});
