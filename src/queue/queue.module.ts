import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMQService } from './providers/rabbitmq.service';
import { SQSQueueService } from './providers/sqs.service';
import { QUEUE_PROVIDER, QUEUE_SERVICE } from './constants';

@Module({})
export class QueueModule {
  static forRootAsync(): DynamicModule {
    return {
      module: QueueModule,
      providers: [
        {
          provide: QUEUE_SERVICE,
          useFactory: (configService: ConfigService) => {
            const provider = configService.get<string>('QUEUE_PROVIDER', 'SQS');

            console.log(`[QueueModule] Initializing provider: ${provider}`);

            switch (provider.toUpperCase()) {
              case 'SQS':
                return new SQSQueueService(configService);
              case 'RABBITMQ':
                return new RabbitMQService(configService);
              default:
                throw new Error(
                  `Unknown queue provider: ${provider}. Valid options: SQS, RABBITMQ`,
                );
            }
          },
          inject: [ConfigService],
        },
        {
          provide: QUEUE_PROVIDER,
          useFactory: (configService: ConfigService) => {
            return configService.get<string>('QUEUE_PROVIDER', 'SQS');
          },
          inject: [ConfigService],
        },
      ],
      exports: [QUEUE_SERVICE, QUEUE_PROVIDER],
    };
  }
}
