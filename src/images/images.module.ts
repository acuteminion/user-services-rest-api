import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImagesService } from './images.service';
import { ImageSchema } from './images.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Image', schema: ImageSchema }]),
  ],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
