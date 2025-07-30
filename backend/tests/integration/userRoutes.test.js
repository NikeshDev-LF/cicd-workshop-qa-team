const request = require('supertest');
const app = require('../../src/server');
const pool = require('../../src/config/database');
const runMigrations = require('../../src/migrations/migrate');

describe('User Routes Integration Tests', () => {
  let testUserId;
  let createdUserIds = [];

  beforeAll(async () => {
    try {
      // Run migrations to ensure database is set up
      await runMigrations();
      
      // Create test data
      const result = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id',
        ['Test User', 'test@example.com']
      );
      testUserId = result.rows[0].id;
      createdUserIds.push(testUserId);
    } catch (error) {
      console.error('❌ Setup failed:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      // Only clean up test-created users
      for (const userId of createdUserIds) {
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
      }
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    }
  });

  describe('GET /api/users', () => {
    test('should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.length).toBeGreaterThanOrEqual(1);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('email');
    });
  });

  describe('GET /api/users/:id', () => {
    test('should return user by id', async () => {
      const response = await request(app)
        .get(`/api/users/${testUserId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', testUserId);
      expect(response.body).toHaveProperty('name', 'Test User');
    });

    test('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/users/999')
        .expect(404);
    });
  });

  describe('POST /api/users', () => {
    test('should create new user', async () => {
      const userData = { name: 'New User', email: 'new@example.com' };
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('name', 'New User');
      expect(response.body).toHaveProperty('email', 'new@example.com');
      expect(response.body).toHaveProperty('id');
      
      // Track for cleanup
      createdUserIds.push(response.body.id);
    });

    test('should return 400 for missing required fields', async () => {
      await request(app)
        .post('/api/users')
        .send({ name: 'Test User' })
        .expect(400);
    });
  });

  describe('PUT /api/users/:id', () => {
    test('should update existing user', async () => {
      const updateData = { name: 'Updated Name', email: 'updated@example.com' };
      
      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('name', 'Updated Name');
      expect(response.body).toHaveProperty('email', 'updated@example.com');
    });

    test('should return 404 for non-existent user', async () => {
      await request(app)
        .put('/api/users/999')
        .send({ name: 'Test', email: 'test@example.com' })
        .expect(404);
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('should delete existing user', async () => {
      // Create a user to delete
      const result = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id',
        ['Delete Me', 'delete@example.com']
      );
      const deleteUserId = result.rows[0].id;
      createdUserIds.push(deleteUserId);

      const response = await request(app)
        .delete(`/api/users/${deleteUserId}`)
        .expect(200);
        
      expect(response.body).toHaveProperty('message', 'User deleted successfully');
      
      // Remove from cleanup list since it's already deleted
      createdUserIds = createdUserIds.filter(id => id !== deleteUserId);
    });

    test('should return 404 for non-existent user', async () => {
      await request(app)
        .delete('/api/users/999')
        .expect(404);
    });
  });
});