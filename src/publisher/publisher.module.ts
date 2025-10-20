import { Module } from '@nestjs/common';
import { PublisherController } from './publisher.controller';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [PublisherController],
})
export class PublisherModule {}
