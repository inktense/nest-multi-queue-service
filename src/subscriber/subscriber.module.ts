import { Module } from '@nestjs/common';
import { SubscriberController } from './subscriber.controller';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule.forRootAsync()],
  controllers: [SubscriberController],
})
export class SubscriberModule {}
