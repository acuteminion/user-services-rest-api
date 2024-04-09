import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import config from '../config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RMQ_MODULE',
        transport: Transport.RMQ,
        options: {
          queue: config().RMQ_PRODUCER_QUEUE,
          urls: [config().RMQ_PRODUCER_URL],
          queueOptions: {
            durable: config().RMQ_PRODUCER_QUEUE_DURABLE,
          },
        },
      },
    ]),
  ],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
