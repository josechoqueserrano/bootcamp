const request = require('supertest');
const app = require('../src/index');

describe('Integration Tests', () => {
  describe('GET /', () => {
    test('should return application info', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.message).toBe('Aplicación Node.js para GitLab CI/CD');
    });
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('uptime');
      expect(typeof response.body.uptime).toBe('number');
    });
  });

  describe('POST /calculate', () => {
    test('should perform addition', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ operation: 'add', a: 5, b: 3 })
        .expect(200);

      expect(response.body).toHaveProperty('result', 8);
    });

    test('should perform subtraction', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ operation: 'subtract', a: 10, b: 4 })
        .expect(200);

      expect(response.body).toHaveProperty('result', 6);
    });

    test('should perform multiplication', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ operation: 'multiply', a: 6, b: 7 })
        .expect(200);

      expect(response.body).toHaveProperty('result', 42);
    });

    test('should perform division', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ operation: 'divide', a: 15, b: 3 })
        .expect(200);

      expect(response.body).toHaveProperty('result', 5);
    });

    test('should return error for invalid operation', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ operation: 'invalid', a: 5, b: 3 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Operación no válida');
    });

    test('should return error for missing parameters', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ operation: 'add', a: 5 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Se requieren operation, a y b');
    });

    test('should handle division by zero', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ operation: 'divide', a: 10, b: 0 })
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('No se puede dividir por cero');
    });

    test('should handle invalid number types', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ operation: 'add', a: 'not_a_number', b: 3 })
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Error handling', () => {
    test('should handle non-existent routes', async () => {
      await request(app)
        .get('/non-existent')
        .expect(404);
    });

    test('should handle malformed JSON', async () => {
      await request(app)
        .post('/calculate')
        .send('invalid json')
        .expect(400);
    });
  });
});