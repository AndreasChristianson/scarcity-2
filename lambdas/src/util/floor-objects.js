import {getLogger} from './logger';
import {accessDDb} from '../util/ddb-crud';

const logger = getLogger('floor-objects');

export const getObjectsOnFloor = async (floor) => {
    var params = {
        TableName : "FloorObjects",
        KeyConditionExpression: "#floor = :value",
        ExpressionAttributeNames:{
            "#floor": "floor"
        },
        ExpressionAttributeValues: {
            ":value": floor
        }
    };
    const objects = accessDDb("query", params);
    logger.trace(`fetched ${objects.length} objects for floor ${floor}`);
    return objects;
}
