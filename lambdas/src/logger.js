import AWS from 'aws-sdk';

const ddb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event, context) => {
    const request = JSON.parse(event.body);
    console.log('Bad request', {request, context});

    return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: `Bad request: ${request}`
    };
};
