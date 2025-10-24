import { SQSQueueService } from './sqs.service';

describe('SQSQueueService', () => {
  it('should be defined', () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          SQS_QUEUE_URL: 'http://localhost:4566/000000000000/space-messages',
          AWS_REGION: 'us-east-1',
          AWS_ACCESS_KEY_ID: 'test',
          AWS_SECRET_ACCESS_KEY: 'test',
          AWS_ENDPOINT: 'http://localhost:4566',
        };
        return config[key] || '';
      }),
    };

    const service = new SQSQueueService(mockConfigService);
    expect(service).toBeDefined();
  });

  it('should throw error if SQS_QUEUE_URL is not provided', () => {
    const invalidConfigService = {
      get: jest.fn(() => ''),
    };

    expect(() => {
      new SQSQueueService(invalidConfigService);
    }).toThrow('SQS_QUEUE_URL is required');
  });
});
