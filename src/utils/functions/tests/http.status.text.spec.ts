import { httpStatusText } from '../http.status.text';

describe('httpStatusText', () => {
  it('returns status text for a given HTTP status code', () => {
    const statusText = httpStatusText(200);
    expect(statusText).toBe('Ok');
  });

  it('returns status text for a different HTTP status code', () => {
    const statusText = httpStatusText(404);
    expect(statusText).toBe('Not Found');
  });

  it('throws an error for a status code that does not exist', () => {
    try {
      httpStatusText(999);
    } catch (error) {
      expect(error.message).toBe('Invalid HTTP status code');
    }
  });

  it('throws an error for an out of range HTTP status code', () => {
    try {
      httpStatusText(1000);
    } catch (error) {
      expect(error.message).toBe('Invalid HTTP status code');
    }
  });
});
