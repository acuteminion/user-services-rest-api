import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service';
import { getModelToken } from '@nestjs/mongoose';
import * as fs from 'fs';

jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  unlinkSync: jest.fn().mockImplementation(() => {}),
}));

describe('ImagesService', () => {
  let service: ImagesService;
  let mockImageModel: any;
  const user_id = '1';
  const image = 'avatar.png';

  beforeEach(async () => {
    mockImageModel = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(true),
      findOne: jest.fn(),
      deleteMany: jest.fn(),
      exec: jest.fn(),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        { provide: getModelToken('Image'), useValue: mockImageModel },
      ],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('save', () => {
    it('should successfully save an image', async () => {
      await expect(service.save(user_id, image)).resolves.not.toThrow();
    });
  });

  describe('findOne', () => {
    it('should return an image for a given userId', async () => {
      mockImageModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ user_id, image }),
      });
      const result = await service.findOne(user_id);
      expect(mockImageModel.findOne).toHaveBeenCalledWith({ user_id: user_id });
      expect(result).toEqual({ user_id, image });
    });
  });

  describe('delete', () => {
    it('should remove an image file and database entry', async () => {
      mockImageModel.deleteMany = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      });

      await service.delete(user_id);

      expect(fs.existsSync).toHaveBeenCalledWith(
        `downloads/${user_id}-image.jpg`,
      );
      expect(fs.unlinkSync).toHaveBeenCalledWith(
        `downloads/${user_id}-image.jpg`,
      );
      expect(mockImageModel.deleteMany).toHaveBeenCalledWith({
        user_id: user_id,
      });
    });

    it('should throw NotFoundException if delete operation fails', async () => {
      mockImageModel.deleteMany = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(new Error('Delete failed')),
      });

      await expect(service.delete(user_id)).rejects.toThrow;
    });
  });
});
