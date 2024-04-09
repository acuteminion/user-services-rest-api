import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import config from '../config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: config().MAIL_HOST,
        port: config().MAIL_PORT,
        secure: config().MAIL_SECURE,
        auth: {
          user: config().MAIL_USERNAME,
          pass: config().MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"${config().MAIL_FROM_NAME}" <${config().MAIL_FROM_ADDRESS}>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailsService],
  exports: [MailsService],
})
export class MailsModule {}
