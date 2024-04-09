import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  UserService(): string {
    return 'This is user service!';
  }
}
