# 🚀 NestJS Multi-Queue Service

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

A flexible NestJS application that supports multiple queue providers (SQS, RabbitMQ) with the ability to run different providers simultaneously using Docker containers.

## 📋 Prerequisites

- **Node.js** 18+ (use `.nvmrc` for version management)
- **Docker** & **Docker Compose**
- **npm** 
- **Localstack**

## 🏗️ Architecture

This project provides a pluggable queue system that can work with:

- **AWS SQS** (via LocalStack)
- **RabbitMQ** 

## 📦 Message Structure

Messages follow this structure:

```typescript
{
  message: string;           // The actual message content
  type: MessageType;         // daily_log | status_update | weather_report | emergency
  location?: string;         // Optional location (e.g., "Mars Surface")
  priority?: Priority;       // Optional priority: low | medium | high | critical
  timestamp?: Date;          // Optional timestamp
}
```

## 🚀 Running the Project

### Option 1: Single Queue Provider

Choose which queue provider to use with the convenient npm scripts.

#### Quick Start:

1. **Start infrastructure services:**
   ```bash
   docker-compose up rabbitmq sqs -d
   ```

2. **Install dependencies:**
   ```bash
   npm run check-node-version
   nvm use
   npm install
   ```

3. **Start with your preferred provider:**
   ```bash
   # Start with SQS
   npm run start:sqs
   
   # OR start with RabbitMQ
   npm run start:rabbitmq
   ```

4. **Wait for startup:**
   ```
   🚀 Application is running on: http://localhost:3000
   ```

5. **Test the API:**
   ```bash
   curl -X POST http://localhost:3000/publish \
     -H "Content-Type: application/json" \
     -d '{
       "message": "Houston, we have a problem with the coffee machine",
       "type": "emergency",
       "location": "International Space Station",
       "priority": "high"
     }'
   ```

### Option 2: Dual Container Setup

Run two instances of the application simultaneously, each using a different queue provider.

#### Quick Start:

1. **Start all services:**
   ```bash
   npm run docker:dual
   # OR
   docker-compose up --build
   ```

2. **Access the applications:**
   - **SQS App**: http://localhost:3001
   - **RabbitMQ App**: http://localhost:3002

3. **Test both providers:**
   ```bash
   # Test SQS app
   curl -X POST http://localhost:3001/publish \
     -H "Content-Type: application/json" \
     -d '{"message": "SQS test message", "type": "status_update"}'
   
   # Test RabbitMQ app  
   curl -X POST http://localhost:3002/publish \
     -H "Content-Type: application/json" \
     -d '{"message": "RabbitMQ test message", "type": "status_update"}'
   ```

## 🔍 Monitoring & Debugging

### RabbitMQ Console
- **URL**: http://localhost:15672
- **Username**: `guest`
- **Password**: `guest`
- View queues and messages in the web interface

### SQS (LocalStack) Commands

**Check queue status:**
```bash
docker exec sqs awslocal sqs get-queue-attributes \
  --queue-url http://localhost:4566/000000000000/space-messages \
  --attribute-names ApproximateNumberOfMessages
```

**Receive messages:**
```bash
docker exec sqs awslocal sqs receive-message \
  --queue-url http://localhost:4566/000000000000/space-messages \
  --max-number-of-messages 10 \
  --wait-time-seconds 0
```

**List all queues:**
```bash
docker exec sqs awslocal sqs list-queues
```

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:cov
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| `rabbitmq` | 5672, 15672 | RabbitMQ broker and management UI |
| `sqs` | 4566 | LocalStack SQS emulation |
| `app-sqs` | 3001 | NestJS app using SQS |
| `app-rabbitmq` | 3002 | NestJS app using RabbitMQ |

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run start:sqs` | Start app with SQS configuration |
| `npm run start:rabbitmq` | Start app with RabbitMQ configuration |
| `npm run docker:dual` | Start dual container setup |
| `npm test` | Run unit tests |
| `npm run test:cov` | Run tests with coverage |


## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `QUEUE_PROVIDER` | Queue provider (SQS/RABBITMQ) | `SQS` |
| `AWS_ENDPOINT` | SQS endpoint (for LocalStack) | `http://localhost:4566` |
| `RABBITMQ_URL` | RabbitMQ connection URL | `amqp://guest:guest@localhost:5672` |
| `PORT` | Application port | `3000` |

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/publish` | Publish a message to the configured queue |
