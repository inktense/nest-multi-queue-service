import { Module } from '@nestjs/common';
import { PublisherController } from './publisher/publisher.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [PublisherController],
  providers: [AppService],
})
export class AppModule {}
