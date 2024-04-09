import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import { Image } from './images.schema';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel('Image') private readonly imageModel: Model<Image>,
  ) {}

  async save(userId: string, image: string): Promise<void> {
    try {
      const newImage = new this.imageModel({ user_id: userId, image });
      await newImage.save();
    } catch (error) {
      console.error(`Saving user image in db failed! [${error}]`);
      throw new Error('Failed to save image.');
    }
  }

  async findOne(userId: string): Promise<Image | null> {
    return this.imageModel.findOne({ user_id: userId }).exec();
  }

  async delete(userId: string): Promise<void> {
    try {
      const filePath = `downloads/${userId}-image.jpg`;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      await this.imageModel.deleteMany({ user_id: userId }).exec();
    } catch (error) {
      console.error(`Deleting user image failed! [${error}]`);
      throw new NotFoundException('Image not found.');
    }
  }
}
