import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import client, { Connection, Channel } from 'amqplib';
import { ConfigService } from '@nestjs/config';
import { IQueueService } from '../interfaces/queue.interface';

@Injectable()
export class RabbitMQService
  implements IQueueService, OnModuleInit, OnModuleDestroy
{
  private connection: Connection;
  private channel: Channel;
  private readonly queueName: string;
  private readonly connectionUrl: string;

  constructor(private configService: ConfigService) {
    if (!this.configService.get<string>('RABBITMQ_URL')) {
      throw new Error('RABBITMQ_URL is not set');
    }

    if (!this.configService.get<string>('RABBITMQ_QUEUE')) {
      throw new Error('RABBITMQ_QUEUE is not set');
    }

    this.connectionUrl = this.configService.get<string>('RABBITMQ_URL') || '';
    this.queueName = this.configService.get<string>('RABBITMQ_QUEUE') || '';
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }
  private async connect(): Promise<void> {
    try {
      console.log('[RabbitMQ] Connecting to:', this.connectionUrl);
      this.connection = await client.connect(this.connectionUrl);
      this.channel = await this.connection.createChannel();

      // Assert queue exists (create if not)
      await this.channel.assertQueue(this.queueName, {
        durable: true, // Queue survives broker restart
      });

      console.log(`[RabbitMQ] Connected and queue '${this.queueName}' ready`);
    } catch (error) {
      console.error('[RabbitMQ] Connection failed:', error);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
      console.log('[RabbitMQ] Disconnected');
    } catch (error) {
      console.error('[RabbitMQ] Error during disconnect:', error.message);
    }
  }
  async publish(message: any): Promise<void> {
    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));

      await this.channel.sendToQueue(this.queueName, messageBuffer, {
        persistent: true, // Message survives broker restart
      });
    } catch (error) {
      console.error('[RabbitMQ] Publish failed:', error);
      throw error;
    }
  }

  async subscribe(): Promise<void> {
    console.log('[RabbitMQ] Starting subscription to queue...');

    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    await this.channel.consume(
      this.queueName,
      async (msg) => {
        if (msg) {
          try {
            const messageContent = JSON.parse(msg.content.toString());
            console.log('[RabbitMQ] Received message:', messageContent);
            this.channel.ack(msg);
            console.log('[RabbitMQ] Message processed and acknowledged');
          } catch (error) {
            console.error('[RabbitMQ] Error processing message:', error);
            this.channel.nack(msg, false, true);
            console.log('[RabbitMQ] Message rejected and requeued');
          }
        }
      },
      { noAck: false },
    );

    console.log('[RabbitMQ] Consumer started successfully');
  }
}
