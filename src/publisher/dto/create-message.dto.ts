import {
  IsString,
  IsEnum,
  IsDate,
  IsOptional,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

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
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  readonly message: string;

  @IsEnum(MessageType)
  @IsNotEmpty()
  readonly type: MessageType;

  @IsString()
  @IsOptional()
  readonly location?: string;

  @IsEnum(Priority)
  @IsOptional()
  readonly priority?: Priority;

  @IsDate()
  @IsOptional()
  readonly timestamp?: Date;
}
