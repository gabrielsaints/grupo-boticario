import chance from './utils/chance';
import request from './utils/request';

describe('Application', () => {
  test('`app` should load without errors', async () => {
    expect.assertions(1);
    const response = await request().options('/');
    expect(response.status).toBe(204);
  });

  test('`app` should allow cors', async () => {
    expect.assertions(1);
    const response = await request().options('/');
    expect(response.header['access-control-allow-origin']).toBe('*');
  });

  test('`app` should return `404` if any route has been not found', async () => {
    expect.assertions(1);
    const response = await request().head(`/${chance.string()}`);
    expect(response.status).toBe(404);
  });
});
