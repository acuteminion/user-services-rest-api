import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ImagesModule } from './images/images.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { MailsModule } from './mails/mails.module';
import { MongodbModule } from './mongodb/mongodb.module';
import config from './config';

@Module({
  imports: [
    UsersModule,
    ImagesModule,
    RabbitmqModule,
    MailsModule,
    MongodbModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
