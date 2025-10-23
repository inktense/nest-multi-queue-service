export enum MessageType {
  DAILY_LOG = 'daily_log',
  STATUS_UPDATE = 'status_update',
  WEATHER_REPORT = 'weather_report',
  EMERGENCY = 'emergency',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export class CreateMessageDto {
  readonly message: string;
  readonly type: MessageType;
  readonly location?: string;
  readonly priority?: Priority;
  readonly timestamp?: Date;
}
