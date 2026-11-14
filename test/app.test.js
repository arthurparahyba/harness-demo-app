const request = require('supertest');
const app = require('../src/app');

describe('harness-demo-app', () => {
  test('GET / retorna mensagem de boas-vindas', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.app).toBe('harness-demo-app');
  });

  test('GET /health retorna UP', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  test('GET /version retorna a versão', async () => {
    const res = await request(app).get('/version');
    expect(res.status).toBe(200);
    expect(res.body.version).toBeDefined();
  });

  test('CRUD de tarefas', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Testar pipeline' });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ title: 'Testar pipeline', done: false });

    const list = await request(app).get('/tasks');
    expect(list.body).toHaveLength(1);

    const updated = await request(app).patch(`/tasks/${created.body.id}`).send({ done: true });
    expect(updated.body.done).toBe(true);

    const removed = await request(app).delete(`/tasks/${created.body.id}`);
    expect(removed.status).toBe(204);
  });

  test('POST /tasks sem title retorna 400', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.status).toBe(400);
  });

  test('PATCH em tarefa inexistente retorna 404', async () => {
    const res = await request(app).patch('/tasks/999').send({ done: true });
    expect(res.status).toBe(404);
  });
});
