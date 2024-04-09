import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import axios, { HttpStatusCode } from 'axios';
import { httpStatusText } from '../utils/functions/http.status.text';
import { MailsService } from '../mails/mails.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { ImagesService } from '../images/images.service';
import { mockUserDto, mockExternalUser, mockAvatar } from './utils/mock.data';
import {
  mailsServiceProvider,
  imagesServiceProvider,
  rabbitmqServiceProvider,
} from './utils/mock.service.providers';
import * as downloadUtil from '../utils/functions/download.file';
import * as fs from 'fs';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const downloadFile = jest
  .spyOn(downloadUtil, 'downloadFile')
  .mockResolvedValue('mockAvatarPath');

describe('UsersService', () => {
  let service: UsersService;
  let rabbitmqService: RabbitmqService;
  let mailService: MailsService;
  let imageService: any;
  let mockUserModel: any;

  const userId = '1';

  beforeEach(async () => {
    mockUserModel = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockUserDto),
    }));

    mockUserModel.exists = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        MailsService,
        RabbitmqService,
        ImagesService,
        {
          provide: RabbitmqService,
          useValue: rabbitmqServiceProvider,
        },
        {
          provide: MailsService,
          useValue: mailsServiceProvider,
        },
        {
          provide: ImagesService,
          useValue: imagesServiceProvider,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    rabbitmqService = module.get<RabbitmqService>(RabbitmqService);
    mailService = module.get<MailsService>(MailsService);
    imageService = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      mockUserModel.exists.mockResolvedValue(false);

      const result = await service.create(mockUserDto);

      expect(mailService.sendCreationEmail).toHaveBeenCalledWith(
        mockUserDto.email,
        `${mockUserDto.first_name} ${mockUserDto.last_name}`,
      );
      expect(rabbitmqService.sendAccountCreationEvent).toHaveBeenCalledWith({
        pattern: 'user-created',
        email: mockUserDto.email,
        data: mockUserDto,
      });
      expect(result.statusCode).toBe(200);
    });

    it('should return error if email already exists', async () => {
      mockUserModel.exists.mockResolvedValue(true);

      const result = await service.create(mockUserDto);

      expect(result.statusCode).toBe(400);
      expect(result.error).toBe(httpStatusText(HttpStatusCode.BadRequest));
      expect(result.message).toBe('email already exists');
    });

    it('should handle errors', async () => {
      mockUserModel.exists.mockRejectedValue(new Error('DB Error'));

      const result = await service.create(mockUserDto);

      expect(result.statusCode).toBe(503);
      expect(result.error).toBe(
        httpStatusText(HttpStatusCode.ServiceUnavailable),
      );
      expect(result.message).toBe('Internal server error');
    });
  });

  describe('getById', () => {
    it('should return user data successfully', async () => {
      mockedAxios.get.mockResolvedValue({ data: { data: mockExternalUser } });

      const result = await service.getById(userId);
      expect(mockedAxios.get).toHaveBeenCalled();
      expect(result.statusCode).toBe(200);
      expect(result.message).toBe(
        'Got user info from external api successfully!',
      );
      expect(result.data.user).toEqual(mockExternalUser);
    });

    it('should handle external API failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API is down'));

      const result = await service.getById(userId);
      expect(result.statusCode).toBe(500);
      expect(result.error).toBe(
        httpStatusText(HttpStatusCode.InternalServerError),
      );
      expect(result.message).toContain('Getting user info failed!');
    });
  });

  describe('getAvatar', () => {
    it('should return avatar if already saved', async () => {
      imageService.findOne.mockResolvedValue({ image: 'base64ImageString' });

      const result = await service.getAvatar(userId);
      expect(result.statusCode).toBe(200);
      expect(result.message).toBe('Avatar received successfully!');
      expect(result.data.base64EncodedImage).toBe('base64ImageString');
    });

    it('should fetch, save, and return avatar if not initially found', async () => {
      imageService.findOne.mockResolvedValueOnce(null);
      jest.spyOn(fs, 'readFileSync').mockReturnValue(mockAvatar);

      mockedAxios.get.mockResolvedValue({
        data: { data: { avatar: 'https://example.com/avatar.png' } },
      });

      const result = await service.getAvatar(userId);
      expect(downloadFile).toHaveBeenCalledWith(
        'https://example.com/avatar.png',
        'downloads',
      );
      expect(imageService.save).toHaveBeenCalledWith(userId, mockAvatar);
      expect(result.statusCode).toBe(200);
      expect(result.message).toBe('Avatar received successfully!');
      expect(result.data.base64EncodedImage).toBe(mockAvatar);
    });

    it('should handle errors when fetching avatar fails', async () => {
      imageService.findOne.mockResolvedValueOnce(null);
      mockedAxios.get.mockRejectedValue(new Error('Failed to fetch avatar'));

      const result = await service.getAvatar(userId);
      expect(result.statusCode).toBe(500);
      expect(result.error).toBe(
        httpStatusText(HttpStatusCode.InternalServerError),
      );
      expect(result.message).toContain('Failed to get user avatar!');
    });
  });

  describe('deleteAvatar', () => {
    it('should successfully delete an avatar', async () => {
      imageService.delete.mockResolvedValue(true);

      const result = await service.deleteAvatar(userId);
      expect(imageService.delete).toHaveBeenCalledWith(userId);
      expect(result.statusCode).toBe(200);
      expect(result.message).toBe('Deleted user avatar successfully!');
      expect(result.data.deletedAvatarUserId).toBe(userId);
    });
  });

  it('should handle errors when deleting an avatar fails', async () => {
    const userId = 'testUserId';
    imageService.delete.mockRejectedValue(new Error('Delete operation failed'));

    const result = await service.deleteAvatar(userId);
    expect(imageService.delete).toHaveBeenCalledWith(userId);
    expect(result.statusCode).toBe(500);
    expect(result.error).toBe(
      httpStatusText(HttpStatusCode.InternalServerError),
    );
    expect(result.message).toContain('Deleting user avatar failed!');
  });
});
