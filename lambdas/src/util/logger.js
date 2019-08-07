import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';

export default (logStreamName = process.env.AWS_LAMBDA_LOG_STREAM_NAME, logGroupName = process.env.AWS_LAMBDA_LOG_GROUP_NAME) =>
    winston.add(new WinstonCloudWatch({
        logGroupName,
        logStreamName
    }));
