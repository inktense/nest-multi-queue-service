import { Module } from '@nestjs/common';
import { PublisherController } from './publisher.controller';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule.forRootAsync()],
  controllers: [PublisherController],
})
export class PublisherModule {}
