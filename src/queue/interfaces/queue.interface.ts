export interface IQueueService {
  publish(message: any): Promise<void>;
  subscribe(): Promise<void>;
}
