import AWS from 'aws-sdk';

exports.handler = async (event, context) => {
    const { echo = 'hello world!' } = JSON.parse(event.body);
    const postData = JSON.stringify(echo);

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: `${event.apiId}.execute-api.${process.env['AWS_REGION']}.amazonaws.com/${event.stage}`        
    });

    const connectionId = event.requestContext.connectionId;

    await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: postData }).promise();

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: `Echo: ${postData}`
    };
};
