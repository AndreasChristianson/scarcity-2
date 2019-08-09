import { accessDDb } from '../util/ddb-crud';


export const handler = async (event, context) => {
    const { requestContext: { connectionId } } = event;
    const params = {
        TableName: 'Connections',
        Key: {
            connectionId
        }
    };

    await accessDDb('delete', params)


    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: `Disconnected ${connectionId}`
    };
};
