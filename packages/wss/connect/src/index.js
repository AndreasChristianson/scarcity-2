import AWS from 'aws-sdk';
import moment from 'moment';

const ddb = new AWS.DynamoDB.DocumentClient();

const sixHoursFromNow = () => moment().add(6, 'hours').unix();

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
