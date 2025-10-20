import { Controller, Post, Body } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';

@Controller('publish')
export class PublisherController {
  constructor(private queueService: QueueService) {}

  @Post()
  async publish(@Body() createPublisherDto: any) {
    await this.queueService.publish(createPublisherDto);
    console.log(createPublisherDto);
  }
}
