import AWS from 'aws-sdk';
import {accessDDb} from '../util/ddb-crud';
import {postToConnection} from '../util/connections';

export const handler = async (event, context) => {
    const { echo = 'hello world!' } = JSON.parse(event.body);
    const postData = JSON.stringify(echo);

    const managementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: `${event.requestContext.apiId}.execute-api.${process.env['AWS_REGION']}.amazonaws.com/${event.requestContext.stage}`
    });

    const scanParams = {
        TableName: 'Connections',
        ProjectionExpression: 'connectionId'
    };

    const connectionData = await accessDDb('scan',scanParams);

    await Promise.all(
        connectionData.Items.map(
            ({ connectionId }) => postToConnection(connectionId, postData)
        )
    );

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: `Echo: ${postData}`
    };
};
