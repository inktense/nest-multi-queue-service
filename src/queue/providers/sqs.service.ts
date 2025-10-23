import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {
  SQSClient,
  SendMessageCommand,
  GetQueueAttributesCommand,
} from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';
import { IQueueService } from '../interfaces/queue.interface';

@Injectable()
export class SQSQueueService
  implements IQueueService, OnModuleInit, OnModuleDestroy
{
  private sqsClient: SQSClient;
  private queueUrl: string;
  private readonly region: string;
  private readonly endpoint: string;
  private subscriptionInterval: NodeJS.Timeout | null = null;

  constructor(private configService: ConfigService) {
    if (!this.configService.get<string>('SQS_QUEUE_URL')) {
      throw new Error('SQS_QUEUE_URL is required');
    }
    this.region = this.configService.get<string>('AWS_REGION', 'us-east-1');
    this.endpoint = this.configService.get<string>('AWS_ENDPOINT', '');
    this.queueUrl = this.configService.get<string>('SQS_QUEUE_URL') || '';

    this.initializeSQSClient();
  }

  private initializeSQSClient(): void {
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    const config: any = {
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    };

    // Add endpoint if provided (for LocalStack)
    if (this.endpoint) {
      config.endpoint = this.endpoint;
    }

    this.sqsClient = new SQSClient(config);
  }

  async onModuleInit(): Promise<void> {
    await this.validateQueue();
  }

  onModuleDestroy(): void {
    if (this.subscriptionInterval) {
      clearInterval(this.subscriptionInterval);
    }
  }

  private async validateQueue(): Promise<void> {
    try {
      const command = new GetQueueAttributesCommand({
        QueueUrl: this.queueUrl,
        AttributeNames: ['QueueArn'],
      });

      await this.sqsClient.send(command);
      console.log(`[SQS] Successfully connected to queue: ${this.queueUrl}`);
    } catch (error) {
      console.error('[SQS] Failed to validate queue:', error);
      throw new Error(
        `SQS queue validation failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async publish(message: any): Promise<void> {
    try {
      const messageBody =
        typeof message === 'string' ? message : JSON.stringify(message);

      const command = new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: messageBody,
        MessageAttributes: {
          timestamp: {
            DataType: 'String',
            StringValue: new Date().toISOString(),
          },
          source: {
            DataType: 'String',
            StringValue: 'nest-multi-queue-service',
          },
        },
      });

      const response = await this.sqsClient.send(command);
      console.log(
        `[SQS] Message published successfully. MessageId: ${response.MessageId}`,
      );
    } catch (error) {
      console.error('[SQS] Publish failed:', error);
      throw new Error(
        `Failed to publish message to SQS: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async subscribe(): Promise<void> {
    console.log('[SQS] Subscribing to queue...');
    // TODO: Implement SQS subscription logic
    return Promise.resolve();
  }
}
