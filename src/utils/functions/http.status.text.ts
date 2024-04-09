import { HttpStatusCode } from 'axios';

export function httpStatusText(httpStatusCode: number) {
  try {
    return HttpStatusCode[httpStatusCode].replace(/([A-Z])/g, ' $1').trim();
  } catch (error) {
    throw new Error('Invalid HTTP status code');
  }
}
