// import { QueueProvider } from '../interfaces/queue.interface';

// export class InMemoryQueueService implements QueueProvider {
//   private queue: any[] = [];

//   async publish(message: any): Promise<void> {
//     this.queue.push(message);
//     console.log('InMemory Queue published:', message);
//   }

//   async subscribe(handler: (message: any) => void): Promise<void> {
//     console.log('InMemory Queue subscription ready');
//     // Simple simulation: process existing messages
//     while (this.queue.length) {
//       handler(this.queue.shift());
//     }
//   }
// }
