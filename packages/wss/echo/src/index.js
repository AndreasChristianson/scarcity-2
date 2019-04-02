import AWS from 'aws-sdk';

export const handler = async (event, context) => {
    const { echo = 'hello world!' } = JSON.parse(event.body);
    const postData = JSON.stringify(echo);

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: `${event.requestContext.apiId}.execute-api.${process.env['AWS_REGION']}.amazonaws.com/${event.requestContext.stage}`
    });

    const scanParams = {
        TableName: process.env.CONNECTIONS_TABLE_NAME,
        ProjectionExpression: 'connectionId'
    };

    const connectionData = await ddb.scan(scanParams).promise();

    await Promise.all(connectionData.Items.map(async ({ connectionId }) => {
        try {
            await apigwManagementApi.postToConnection({
                ConnectionId: connectionId,
                Data: postData
            }).promise()
        } catch (error) {
            if (error.statusCode !== 410) {
                throw error;
            }
        }
    }));

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: `Echo: ${postData}`
    };
};
