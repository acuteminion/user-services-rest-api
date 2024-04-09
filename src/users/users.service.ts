import { Injectable } from '@nestjs/common';
import axios, { HttpStatusCode } from 'axios';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { UserDto } from './dto/users.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { ImagesService } from '../images/images.service';
import { MailsService } from '../mails/mails.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { errorResponse } from '../utils/responses/error.response';
import { successResponse } from '../utils/responses/success.response';
import { Response } from '../utils/interfaces/response.interface';
import { UserConfig } from './users.config';
import { downloadFile } from '../utils/functions/download.file';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly rabbitMQService: RabbitmqService,
    private readonly mailService: MailsService,
    private readonly imageService: ImagesService,
  ) {}

  async create(userDto: UserDto) {
    try {
      const newUser = new this.userModel(userDto);

      const isDuplicatedEmail = await this.userModel.exists({
        email: newUser.email,
      });

      if (isDuplicatedEmail) {
        return errorResponse(HttpStatusCode.BadRequest, 'email already exists');
      }

      const savedUser = await newUser.save();
      const userName = `${savedUser.first_name} ${savedUser.last_name}`;

      await Promise.all([
        this.mailService.sendCreationEmail(savedUser.email, userName),
        this.rabbitMQService.sendAccountCreationEvent({
          pattern: 'user-created',
          email: savedUser.email,
          data: savedUser,
        }),
      ]);
      return successResponse('Saved user info in db successfully!', {
        newUser: savedUser,
      });
    } catch (error) {
      console.error(`Saving user info in db failed! [${error}]`);
      return errorResponse(
        HttpStatusCode.ServiceUnavailable,
        'Internal server error',
      );
    }
  }

  async getById(id: string): Promise<Response> {
    try {
      const response = await axios.get(`${UserConfig.USERS_API_URL}/${id}`, {
        headers: { Accept: 'application/json' },
      });
      return successResponse('Got user info from external api successfully!', {
        user: response.data.data,
      });
    } catch (error) {
      return errorResponse(
        HttpStatusCode.InternalServerError,
        `Getting user info failed! [${error}]`,
      );
    }
  }

  async getAvatar(id: string): Promise<Response> {
    try {
      const avatar = await this.imageService.findOne(id);
      const userUrl = `${UserConfig.USERS_API_URL}/${id}`;
      if (avatar) {
        return successResponse('Avatar received successfully!', {
          userId: id,
          imageUrl: userUrl,
          base64EncodedImage: avatar.image,
        });
      } else {
        const response = await axios.get(userUrl, {
          headers: { Accept: 'application/json' },
        });

        const avatarUrl = response.data.data.avatar;
        const imageFilePath = await downloadFile(avatarUrl, 'downloads');
        const image = fs.readFileSync(imageFilePath, { encoding: 'base64' });
        await this.imageService.save(id, image);
        return successResponse('Avatar received successfully!', {
          userId: id,
          imageUrl: avatarUrl,
          base64EncodedImage: image,
        });
      }
    } catch (error) {
      return errorResponse(
        HttpStatusCode.InternalServerError,
        `Failed to get user avatar! [${error}]`,
      );
    }
  }

  async deleteAvatar(id: string) {
    try {
      await this.imageService.delete(id);
      return successResponse('Deleted user avatar successfully!', {
        deletedAvatarUserId: id,
      });
    } catch (error) {
      return errorResponse(
        HttpStatusCode.InternalServerError,
        `Deleting user avatar failed! [${error}]`,
      );
    }
  }
}
