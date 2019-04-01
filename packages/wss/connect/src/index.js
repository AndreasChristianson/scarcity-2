import AWS from 'aws-sdk';

const ddb = new AWS.DynamoDB.DocumentClient();

const sixHoursFromNow = () => Math.floor(Date.now() / 1000) + 60 * 60 * 6;

exports.handler = async (event, context) => {
    const { requestContext: { connectionId } } = event;
    const putParams = {
        TableName: process.env.TABLE_NAME,
        Item: {
            connectionId,
            ttl: sixHoursFromNow()
        }
    };

    await ddb.put(putParams).promise();

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: `Connected.`
    };
};
