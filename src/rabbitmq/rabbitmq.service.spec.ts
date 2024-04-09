import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqService } from './rabbitmq.service';

describe('RabbitmqService', () => {
  let service: RabbitmqService;
  let clientProxyMock: { emit: jest.Mock };
  const pattern = 'user-created';
  const email = 'test@example.com';
  const data = { email };

  beforeEach(async () => {
    clientProxyMock = {
      emit: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        toPromise: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitmqService,
        { provide: 'RMQ_MODULE', useValue: clientProxyMock },
      ],
    }).compile();

    service = module.get<RabbitmqService>(RabbitmqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendAccountCreationEvent', () => {
    it('should successfully send an account creation event', async () => {
      await service.sendAccountCreationEvent({ pattern, email, data });
      clientProxyMock.emit.mockReturnValueOnce({
        pipe: jest.fn().mockReturnThis(),
        toPromise: jest.fn().mockResolvedValue(true),
      });

      expect(clientProxyMock.emit).toHaveBeenCalledWith(pattern, data);
    });

    it('should handle errors when sending an account creation event fails', async () => {
      const error = new Error('Emit failed');
      clientProxyMock.emit.mockReturnValueOnce({
        pipe: jest.fn().mockReturnThis(),
        toPromise: jest.fn().mockRejectedValue(error),
      });

      await service.sendAccountCreationEvent({ pattern, email, data });

      expect(clientProxyMock.emit).toHaveBeenCalledWith(pattern, data);
    });
  });
});
