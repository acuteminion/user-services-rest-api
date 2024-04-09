import { Test, TestingModule } from '@nestjs/testing';
import { MailsService } from './mails.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('MailsService', () => {
  let service: MailsService;
  let mailerServiceMock: { sendMail: jest.Mock };
  const email = 'test@example.com';
  const name = 'Test User';

  beforeEach(async () => {
    mailerServiceMock = {
      sendMail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailsService,
        { provide: MailerService, useValue: mailerServiceMock },
      ],
    }).compile();

    service = module.get<MailsService>(MailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully send a creation email', async () => {
    await service.sendCreationEmail(email, name);

    expect(mailerServiceMock.sendMail).toHaveBeenCalledWith({
      to: email,
      subject: 'Account created successfully!',
      template: 'created',
      context: {
        name: name,
        email: email,
      },
    });
  });

  it('should handle errors when sending email fails', async () => {
    mailerServiceMock.sendMail.mockRejectedValue(
      new Error('Email send failed'),
    );

    await service.sendCreationEmail(email, name);

    expect(mailerServiceMock.sendMail).toHaveBeenCalledWith({
      to: email,
      subject: 'Account created successfully!',
      template: 'created',
      context: {
        name: name,
        email: email,
      },
    });
  });
});
