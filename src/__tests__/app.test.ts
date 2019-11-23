import App from '../app';

describe('app', () => {
  it('should greet', () => {
    const app = new App();
    expect(app.greet()).toBe('Hello, World!');
  });
});
