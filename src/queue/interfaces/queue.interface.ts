export interface IQueueService {
  publish(message: any): Promise<void>;
  subscribe(handler?: (message: any) => void): Promise<void>;
}
