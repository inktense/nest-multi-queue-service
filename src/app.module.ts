import { Module } from '@nestjs/common';
import { QueueModule } from './queue/queue.module';
import { PublisherModule } from './publisher/publisher.module';

@Module({
  imports: [QueueModule, PublisherModule],
})
export class AppModule {}
