const pool = require('../src/config/database');

// Global teardown to close database connections
afterAll(async () => {
  await pool.end();
});

// Increase timeout for database operations
jest.setTimeout(15000); 