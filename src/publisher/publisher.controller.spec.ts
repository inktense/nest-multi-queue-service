import { Test, TestingModule } from '@nestjs/testing';
import { PublisherController } from './publisher.controller';
import { QUEUE_PROVIDER, QUEUE_SERVICE } from '../queue/constants';
import {
  CreateMessageDto,
  MessageType,
  Priority,
} from './dto/create-message.dto';
import { IQueueService } from '../queue/interfaces/queue.interface';

describe('PublisherController', () => {
  let controller: PublisherController;
  let mockQueueService: jest.Mocked<IQueueService>;

  beforeEach(async () => {
    // Create a mock queue service
    mockQueueService = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublisherController],
      providers: [
        {
          provide: QUEUE_SERVICE,
          useValue: mockQueueService,
        },
        {
          provide: QUEUE_PROVIDER,
          useValue: 'SQS',
        },
      ],
    }).compile();

    controller = module.get<PublisherController>(PublisherController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should log initialization with provider', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      new PublisherController(mockQueueService, 'RABBITMQ');
      expect(consoleSpy).toHaveBeenCalledWith(
        '[PublisherController] Initialized with provider: RABBITMQ',
      );
      consoleSpy.mockRestore();
    });
  });

  describe('publish', () => {
    const validMessageDto: CreateMessageDto = {
      message: 'Houston, we have a problem with the coffee machine',
      type: MessageType.EMERGENCY,
      location: 'International Space Station',
      priority: Priority.HIGH,
      timestamp: new Date('2024-01-15T14:30:00Z'),
    };

    it('should publish a message successfully', async () => {
      mockQueueService.publish.mockResolvedValue(undefined);

      const result = await controller.publish(validMessageDto);

      expect(mockQueueService.publish).toHaveBeenCalledWith(validMessageDto);
      expect(result).toEqual({
        status: 'Message published',
        provider: 'SQS',
        message: validMessageDto,
      });
    });

    it('should log publishing message', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      mockQueueService.publish.mockResolvedValue(undefined);

      await controller.publish(validMessageDto);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Publishing message via SQS provider...',
      );
      consoleSpy.mockRestore();
    });

    it('should handle minimal message data', async () => {
      const minimalMessageDto: CreateMessageDto = {
        message: 'Simple message',
        type: MessageType.STATUS_UPDATE,
      };

      mockQueueService.publish.mockResolvedValue(undefined);

      const result = await controller.publish(minimalMessageDto);

      expect(mockQueueService.publish).toHaveBeenCalledWith(minimalMessageDto);
      expect(result).toEqual({
        status: 'Message published',
        provider: 'SQS',
        message: minimalMessageDto,
      });
    });

    it('should handle different message types', async () => {
      const messageTypes = [
        MessageType.DAILY_LOG,
        MessageType.STATUS_UPDATE,
        MessageType.WEATHER_REPORT,
        MessageType.EMERGENCY,
      ];

      for (const messageType of messageTypes) {
        const messageDto: CreateMessageDto = {
          message: `Test message for ${messageType}`,
          type: messageType,
        };

        mockQueueService.publish.mockResolvedValue(undefined);

        const result = await controller.publish(messageDto);

        expect(result.message.type).toBe(messageType);
        expect(mockQueueService.publish).toHaveBeenCalledWith(messageDto);
      }
    });

    it('should handle different priorities', async () => {
      const priorities = [
        Priority.LOW,
        Priority.MEDIUM,
        Priority.HIGH,
        Priority.CRITICAL,
      ];

      for (const priority of priorities) {
        const messageDto: CreateMessageDto = {
          message: `Test message with ${priority} priority`,
          type: MessageType.STATUS_UPDATE,
          priority,
        };

        mockQueueService.publish.mockResolvedValue(undefined);

        const result = await controller.publish(messageDto);

        expect(result.message.priority).toBe(priority);
        expect(mockQueueService.publish).toHaveBeenCalledWith(messageDto);
      }
    });

    it('should propagate queue service errors', async () => {
      const error = new Error('Queue service failed');
      mockQueueService.publish.mockRejectedValue(error);

      await expect(controller.publish(validMessageDto)).rejects.toThrow(
        'Queue service failed',
      );
    });

    it('should work with different providers', async () => {
      // Test with RabbitMQ provider
      const rabbitMQModule: TestingModule = await Test.createTestingModule({
        controllers: [PublisherController],
        providers: [
          {
            provide: QUEUE_SERVICE,
            useValue: mockQueueService,
          },
          {
            provide: QUEUE_PROVIDER,
            useValue: 'RABBITMQ',
          },
        ],
      }).compile();

      const rabbitMQController =
        rabbitMQModule.get<PublisherController>(PublisherController);

      mockQueueService.publish.mockResolvedValue(undefined);

      const result = await rabbitMQController.publish(validMessageDto);

      expect(result.provider).toBe('RABBITMQ');
      expect(mockQueueService.publish).toHaveBeenCalledWith(validMessageDto);
    });

    it('should handle space-themed messages', async () => {
      const spaceMessages = [
        {
          message: 'Mars rover discovered alien artifacts',
          type: MessageType.DAILY_LOG,
          location: 'Mars Surface',
          priority: Priority.HIGH,
        },
        {
          message: 'Solar flare detected - communications may be disrupted',
          type: MessageType.WEATHER_REPORT,
          location: 'Solar System',
          priority: Priority.CRITICAL,
        },
        {
          message: 'Space station maintenance completed successfully',
          type: MessageType.STATUS_UPDATE,
          location: 'International Space Station',
          priority: Priority.MEDIUM,
        },
      ];

      for (const spaceMessage of spaceMessages) {
        mockQueueService.publish.mockResolvedValue(undefined);

        const result = await controller.publish(spaceMessage);

        expect(result.status).toBe('Message published');
        expect(result.message).toEqual(spaceMessage);
        expect(mockQueueService.publish).toHaveBeenCalledWith(spaceMessage);
      }
    });
  });

  describe('integration scenarios', () => {
    it('should handle rapid message publishing', async () => {
      const messages = Array.from({ length: 5 }, (_, i) => ({
        message: `Rapid message ${i + 1}`,
        type: MessageType.STATUS_UPDATE,
      }));

      mockQueueService.publish.mockResolvedValue(undefined);

      const promises = messages.map((msg) => controller.publish(msg));
      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      expect(mockQueueService.publish).toHaveBeenCalledTimes(5);
      results.forEach((result, index) => {
        expect(result.message.message).toBe(`Rapid message ${index + 1}`);
      });
    });

    it('should maintain provider consistency across multiple calls', async () => {
      const messages = [
        { message: 'First message', type: MessageType.DAILY_LOG },
        { message: 'Second message', type: MessageType.STATUS_UPDATE },
        { message: 'Third message', type: MessageType.WEATHER_REPORT },
      ];

      mockQueueService.publish.mockResolvedValue(undefined);

      for (const message of messages) {
        const result = await controller.publish(message);
        expect(result.provider).toBe('SQS');
      }
    });
  });
});
