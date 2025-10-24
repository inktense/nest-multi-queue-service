import { RabbitMQService } from './rabbitmq.service';

// Mock amqplib
jest.mock('amqplib', () => ({
  connect: jest.fn().mockResolvedValue({
    createChannel: jest.fn().mockResolvedValue({
      assertQueue: jest.fn(),
      sendToQueue: jest.fn(),
      close: jest.fn(),
    }),
    close: jest.fn(),
  }),
}));

describe('RabbitMQService', () => {
  it('should be defined', () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          RABBITMQ_URL: 'amqp://guest:guest@localhost:5672',
          RABBITMQ_QUEUE: 'space-messages',
        };
        return config[key] || '';
      }),
    };

    const service = new RabbitMQService(mockConfigService);
    expect(service).toBeDefined();
  });

  it('should throw error if RABBITMQ_URL is not provided', () => {
    const invalidConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'RABBITMQ_URL') return '';
        return 'test-value';
      }),
    };

    expect(() => {
      new RabbitMQService(invalidConfigService);
    }).toThrow('RABBITMQ_URL is not set');
  });

  it('should throw error if RABBITMQ_QUEUE is not provided', () => {
    const invalidConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'RABBITMQ_QUEUE') return '';
        return 'test-value';
      }),
    };

    expect(() => {
      new RabbitMQService(invalidConfigService);
    }).toThrow('RABBITMQ_QUEUE is not set');
  });
});
