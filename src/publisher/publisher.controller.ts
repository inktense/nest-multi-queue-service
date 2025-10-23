import { Controller, Post, Body, Inject } from '@nestjs/common';
import { QUEUE_PROVIDER, QUEUE_SERVICE } from '../queue/constants';
import type { IQueueService } from '../queue/interfaces/queue.interface';

@Controller('publish')
export class PublisherController {
  constructor(
    @Inject(QUEUE_SERVICE) private readonly queueService: IQueueService,
    @Inject(QUEUE_PROVIDER) private readonly provider: string,
  ) {
    console.log(`[PublisherController] Initialized with provider: ${provider}`);
  }

  @Post()
  async publish(@Body() createPublisherDto: any) {
    console.log(`Publishing message via ${this.provider} provider...`);
    await this.queueService.publish(createPublisherDto);
    return {
      status: 'Message published',
      provider: this.provider,
      message: createPublisherDto,
    };
  }
}
