import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { eventParams } from './typs';

@Injectable()
export class RabbitmqService {
  constructor(@Inject('RMQ_MODULE') private readonly client: ClientProxy) {}

  public async sendAccountCreationEvent({ pattern, email, data }: eventParams) {
    try {
      await firstValueFrom(this.client.emit(pattern, data));
      console.log(
        `Sent account creation event for user <${email}> successfully!`,
      );
    } catch (error) {
      console.error(
        `Sending account creation event for user <${email}> failed!`,
        error,
      );
    }
  }
}
