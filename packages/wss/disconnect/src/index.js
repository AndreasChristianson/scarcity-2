import AWS from 'aws-sdk';

const ddb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event, context) => {
    const { requestContext: { connectionId } } = event;
    const params = {
        TableName: process.env.CONNECTIONS_TABLE_NAME,
        Key: {
            connectionId
        }
    };

    await ddb.delete(params).promise();

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: `Disconnected.`
    };
};
