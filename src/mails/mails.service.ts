import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}

  async sendCreationEmail(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Account created successfully!',
        template: 'created',
        context: {
          name: name,
          email: email,
        },
      });
      console.log(`Sent user creation email to <${email}> successfully!`);
    } catch (error) {
      console.log(
        `Sending user creation email to <${email}> failed! [${error}]`,
      );
    }
  }
}
