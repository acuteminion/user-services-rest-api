import { Response } from '../interfaces/response.interface';
import { httpStatusText } from '../functions/http.status.text';

export function errorResponse(
  httpStatusCode: number,
  message: string | string[],
): Response {
  return {
    statusCode: httpStatusCode,
    error: httpStatusText(httpStatusCode),
    message: message,
  };
}
