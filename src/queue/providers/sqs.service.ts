import { Injectable } from '@nestjs/common';
import { IQueueService } from '../interfaces/queue.interface';

@Injectable()
export class SQSQueueService implements IQueueService {
  async publish(message: any): Promise<void> {
    console.log('[SQS] Publishing message:', message);
  }

  async subscribe(handler?: (message: any) => void): Promise<void> {
    console.log('[SQS] Subscribing to queue...');
  }
}
