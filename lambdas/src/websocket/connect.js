import moment from 'moment';
import { accessDDb } from '../util/ddb-crud';


const sixHoursFromNow = () => moment().add(6, 'hours').unix();

export const handler = async (event, context) => {
    const { requestContext: { connectionId } } = event;
    const putParams = {
        TableName: 'Connections',
        Item: {
            connectionId,
            ttl: sixHoursFromNow()
        }
    };

    await accessDDb('put', putParams)

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: `Connected.`
    };
};
