import request from 'supertest';
import app from '../src/index.js';

describe('POST /api/login', () => {
  it('deve retornar um token de autenticação válido', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        username: 'username',
        password: 'password'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('access_token');
  });

  it('deve retornar um erro para credenciais inválidas', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        username: 'usernamgggge',
        password: 'invalidPassword'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});
