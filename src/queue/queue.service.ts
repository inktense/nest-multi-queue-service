import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { QueueProvider } from './queue.interface';
import { InMemoryQueueService } from './providers/in-memory.provider';

@Injectable()
export class QueueService implements QueueProvider {
  private provider: QueueProvider;

  constructor(private readonly configService: ConfigService) {
    const type =
      this.configService.get<string>('QUEUE_PROVIDER') || 'in-memory';

    if (type === 'in-memory') {
      this.provider = new InMemoryQueueService();
    }
  }

  async publish(message: any): Promise<void> {
    return this.provider.publish(message);
  }

  async subscribe(handler: (message: any) => void): Promise<void> {
    return this.provider.subscribe(handler);
  }
}
