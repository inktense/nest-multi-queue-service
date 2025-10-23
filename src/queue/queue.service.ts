// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

// import { QueueProvider } from './queue.interface';
// import { InMemoryQueueService } from './providers/in-memory.provider';
// import { RabbitMQService } from './providers/rabbitmq.service';

// const providerMap: Record<string, new () => QueueProvider> = {
//   //   SQS: SqsQueueService,
//   RABBITMQ: RabbitMQService,
//   INMEMORY: InMemoryQueueService,
// };

// @Injectable()
// export class QueueService implements QueueProvider {
//   private provider: QueueProvider;

//   constructor(private readonly configService: ConfigService) {
//     if (!this.configService.get<string>('QUEUE_PROVIDER')) {
//       throw new Error('QUEUE_PROVIDER is not set');
//     }

//     const providerName =
//       this.configService.get<string>('QUEUE_PROVIDER') || 'INMEMORY';

//     this.provider = new providerMap[providerName]();
//   }

//   async publish(message: any): Promise<void> {
//     return this.provider.publish(message);
//   }

//   async subscribe(handler: (message: any) => void): Promise<void> {
//     return this.provider.subscribe(handler);
//   }
// }
