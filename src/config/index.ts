import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export default () => ({
  //APP
  APP_NAME: configService.get<string>('APP_NAME') || 'User service API',
  APP_ENV: configService.get<string>('APP_ENV') || 'local',
  PORT: configService.get<number>('PORT') || 3000,

  //DB
  DB_URL:
    configService.get<string>('DB_URL') || 'mongodb://localhost:27017/payever',

  //MAIL
  MAIL_HOST:
    configService.get<string>('MAIL_HOST') || 'sandbox.smtp.mailtrap.io',
  MAIL_PORT: configService.get<number>('MAIL_PORT') || 587,
  MAIL_IGNORE_TLS: configService.get<boolean>('MAIL_IGNORE_TLS') || true,
  MAIL_SECURE: configService.get<boolean>('MAIL_SECURE') || false,
  MAIL_USERNAME: configService.get<string>('MAIL_USERNAME') || '9e7e453e146075',
  MAIL_PASSWORD: configService.get<string>('MAIL_PASSWORD') || 'a04139e44c40e2',
  MAIL_FROM_ADDRESS:
    configService.get<string>('MAIL_FROM_ADDRESS') || 'mail@sender.com',
  MAIL_FROM_NAME: configService.get<string>('MAIL_FROM_NAME') || 'Mail Sender',

  //RMQ
  RMQ_PRODUCER_QUEUE:
    configService.get<string>('RMQ_PRODUCER_QUEUE') || 'user-events',
  RMQ_PRODUCER_URL:
    configService.get<string>('RMQ_PRODUCER_URL') || 'amqp://127.0.0.1',
  RMQ_PRODUCER_QUEUE_DURABLE:
    configService.get<boolean>('RMQ_PRODUCER_QUEUE_DURABLE') || false,
});
