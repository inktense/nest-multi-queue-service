# 🚀 Developer Environment Setup Guide

## 🎯 **Environment Management with Separate Files**

Use the provided environment files for different configurations:

```bash
env.sqs          # SQS configuration
env.rabbitmq     # RabbitMQ configuration
env.production   # Production configuration
env.template     # Template for new developers
```

### **Quick Setup Commands**

```bash
# Copy template to .env
cp env.template .env

# Or copy specific configuration
cp env.sqs .env        # For SQS
cp env.rabbitmq .env   # For RabbitMQ
```

## 🛠️ **Quick Start Commands**

### **Single Provider Development**

```bash
# 1. Setup environment
cp env.sqs .env          # or cp env.rabbitmq .env

# 2. Start infrastructure
npm run docker:up

# 3. Start development server
npm run start:dev

# 4. Test
curl -X POST http://localhost:3000/publish \
  -H "Content-Type: application/json" \
  -d '{"message":"test","type":"status_update"}'
```

### **Dual Container Setup**

```bash
# 1. Start all services (uses docker-compose environment variables)
npm run docker:dual

# 2. Test both providers
# SQS App: http://localhost:3001
# RabbitMQ App: http://localhost:3002
```

## 🔧 **Environment Variables Reference**

### **SQS Configuration**
```bash
QUEUE_PROVIDER=SQS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_ENDPOINT=http://localhost:4566
SQS_QUEUE_URL=http://localhost:4566/000000000000/space-messages
```

### **RabbitMQ Configuration**
```bash
QUEUE_PROVIDER=RABBITMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672
RABBITMQ_QUEUE=space-messages
```

## 🐳 **Docker Commands**

```bash
# Start infrastructure only
docker-compose up rabbitmq sqs -d

# Start with app containers
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f app-sqs
docker-compose logs -f app-rabbitmq
```

## 🧪 **Testing Commands**

```bash
# Unit tests
npm test

# Integration tests
npm run test:e2e

# Manual testing
curl -X POST http://localhost:3001/publish \
  -H "Content-Type: application/json" \
  -d '{"message":"SQS test","type":"status_update"}'

curl -X POST http://localhost:3002/publish \
  -H "Content-Type: application/json" \
  -d '{"message":"RabbitMQ test","type":"status_update"}'
```

## 🔍 **Monitoring & Debugging**

### **RabbitMQ Console**
- URL: http://localhost:15672
- Username: `guest`
- Password: `guest`

### **SQS Commands**
```bash
# Check queue status
docker exec sqs awslocal sqs get-queue-attributes \
  --queue-url http://localhost:4566/000000000000/space-messages \
  --attribute-names ApproximateNumberOfMessages

# Receive messages
docker exec sqs awslocal sqs receive-message \
  --queue-url http://localhost:4566/000000000000/space-messages \
  --max-number-of-messages 10 \
  --wait-time-seconds 0
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Port conflicts**: Make sure ports 3000, 3001, 3002, 4566, 5672, 15672 are available
2. **Container startup**: Wait for health checks to pass before testing
3. **Environment variables**: Use `npm run env:setup` to verify configuration

### **Reset Everything**
```bash
# Stop and remove all containers
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Start fresh
npm run docker:build
```

## 📝 **Development Workflow**

1. **Choose your setup**: Single provider or dual containers
2. **Setup environment**: Copy appropriate env file to .env
3. **Start services**: Infrastructure first, then app
4. **Develop**: Make changes and test
5. **Monitor**: Use provided tools to check queue status
6. **Test**: Run automated tests and manual verification

## 📁 **Environment Files**

| File | Purpose | Usage |
|------|---------|-------|
| `env.template` | Development template | Copy to `.env` for development |
| `env.sqs` | SQS configuration | `cp env.sqs .env` |
| `env.rabbitmq` | RabbitMQ configuration | `cp env.rabbitmq .env` |
| `env.production` | Production template | Reference for production setup |
