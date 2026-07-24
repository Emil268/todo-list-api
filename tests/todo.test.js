const request = require('supertest');
const app = require('../app');
const { connectTestDB, closeTestDB, clearTestDB } = require('./setup');

const API = '/api/v1';

let token;
let categoryId;

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

const registerAndLogin = async () => {
  const res = await request(app).post(`${API}/auth/register`).send({
    name: 'Todo Tester',
    email: 'tester@example.com',
    password: 'password123',
  });
  return res.body.data.token;
};

beforeEach(async () => {
  token = await registerAndLogin();

  const catRes = await request(app)
    .post(`${API}/categories`)
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Work', description: 'Work stuff' });

  categoryId = catRes.body.data.category._id;
});

describe('Todo API', () => {
  describe('POST /todos', () => {
    it('should create a new todo for the authenticated user', async () => {
      const res = await request(app)
        .post(`${API}/todos`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Write documentation', category: categoryId, priority: 'high' });

      expect(res.status).toBe(201);
      expect(res.body.data.todo.title).toBe('Write documentation');
      expect(res.body.data.todo.status).toBe('pending');
    });

    it('should return 401 without a token', async () => {
      const res = await request(app).post(`${API}/todos`).send({ title: 'No auth todo' });
      expect(res.status).toBe(401);
    });

    it('should return 400 for missing title', async () => {
      const res = await request(app)
        .post(`${API}/todos`)
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'no title here' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /todos', () => {
    beforeEach(async () => {
      const titles = ['Buy milk', 'Clean house', 'Finish report', 'Read book', 'Write tests'];
      for (const title of titles) {
        // eslint-disable-next-line no-await-in-loop
        await request(app)
          .post(`${API}/todos`)
          .set('Authorization', `Bearer ${token}`)
          .send({ title, category: categoryId });
      }
    });

    it('should return paginated todos with default page/limit', async () => {
      const res = await request(app).get(`${API}/todos`).set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.todos.length).toBe(5);
      expect(res.body.meta).toMatchObject({ total: 5, page: 1 });
    });

    it('should respect limit and page query params', async () => {
      const res = await request(app)
        .get(`${API}/todos?page=2&limit=2`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.todos.length).toBe(2);
      expect(res.body.meta.page).toBe(2);
      expect(res.body.meta.totalPages).toBe(3);
    });

    it('should filter todos by search keyword', async () => {
      const res = await request(app)
        .get(`${API}/todos?search=report`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.todos.length).toBe(1);
      expect(res.body.data.todos[0].title).toBe('Finish report');
    });
  });

  describe('PUT /todos/:id', () => {
    it('should update a todo status', async () => {
      const createRes = await request(app)
        .post(`${API}/todos`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task to update' });

      const { id } = createRes.body.data.todo._id
        ? { id: createRes.body.data.todo._id }
        : { id: undefined };

      const res = await request(app)
        .put(`${API}/todos/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'completed' });

      expect(res.status).toBe(200);
      expect(res.body.data.todo.status).toBe('completed');
    });
  });

  describe('DELETE /todos/:id (soft delete)', () => {
    it('should archive the todo instead of removing it, and hide it from GET /todos', async () => {
      const createRes = await request(app)
        .post(`${API}/todos`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task to delete' });

      const id = createRes.body.data.todo._id;

      const delRes = await request(app)
        .delete(`${API}/todos/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(delRes.status).toBe(200);

      const listRes = await request(app).get(`${API}/todos`).set('Authorization', `Bearer ${token}`);
      const found = listRes.body.data.todos.find((t) => t._id === id);
      expect(found).toBeUndefined();
    });

    it('should return 404 when deleting a non-existent todo', async () => {
      const res = await request(app)
        .delete(`${API}/todos/64b6f0f0f0f0f0f0f0f0f0f0`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});
