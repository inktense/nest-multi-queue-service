import { Controller, Post, Inject } from '@nestjs/common';
import { QUEUE_PROVIDER, QUEUE_SERVICE } from '../queue/constants';
import type { IQueueService } from '../queue/interfaces/queue.interface';

@Controller('subscribe')
export class SubscriberController {
  constructor(
    @Inject(QUEUE_SERVICE) private readonly queueService: IQueueService,
    @Inject(QUEUE_PROVIDER) private readonly provider: string,
  ) {
    console.log(
      `[SubscriberController] Initialized with provider: ${provider}`,
    );
  }

  @Post()
  async subscribe() {
    console.log(`Starting subscription via ${this.provider} provider...`);

    await this.queueService.subscribe();

    return {
      status: 'Subscription started',
      provider: this.provider,
      message: 'Listening for messages...',
    };
  }
}
