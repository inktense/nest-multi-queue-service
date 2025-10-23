import { Injectable } from '@nestjs/common';
import { IQueueService } from '../interfaces/queue.interface';

@Injectable()
export class RabbitMQService implements IQueueService {
  async publish(message: any): Promise<void> {
    console.log('[RabbitMQ] Publishing message:', message);
  }

  async subscribe(handler?: (message: any) => void): Promise<void> {
    console.log('[RabbitMQ] Subscribing to queue...');
  }
}
