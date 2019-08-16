import {accessDDb} from '../util/ddb-crud';
import {postToConnection} from '../util/connections';

export const handler = async (event, context) => {
    const { echo = 'hello world!' } = JSON.parse(event.body);
    const postData = JSON.stringify(echo);

    const scanParams = {
        TableName: 'Connections',
        ProjectionExpression: 'connectionId'
    };

    const connectionData = await accessDDb('scan', scanParams);

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
