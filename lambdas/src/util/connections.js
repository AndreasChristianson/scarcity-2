import AWS from 'aws-sdk';
import {getLogger} from './logger';

const logger = getLogger('ddb');

const managementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: `${process.env['API_ID']}.execute-api.${process.env['AWS_REGION']}.amazonaws.com/${process.env['STAGE']}`
});

export const postToConnection = async (ConnectionId, Data) => {
    try {
        logger.trace('Sending websocket message', { ConnectionId, Data });
        await managementApi.postToConnection({
            ConnectionId,
            Data
        }).promise()
        logger.trace('Sent websocket message', { ConnectionId, Data });
    } catch (error) {
        if (error.statusCode !== 410) {
        logger.error('error when sending message.', { error, ConnectionId, Data });

            throw error;
        }
    }
}