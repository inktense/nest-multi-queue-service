#!/bin/bash
echo "Creating SQS queue..."
awslocal sqs create-queue --queue-name space-messages --attributes VisibilityTimeout=30,MessageRetentionPeriod=86400
echo "SQS queue 'space-messages' created successfully!"
awslocal sqs list-queues