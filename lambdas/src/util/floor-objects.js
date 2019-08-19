import {getLogger} from './logger';
import {accessDDb} from '../util/ddb-crud';

const logger = getLogger('floor-objects');

export const getObjectsOnFloor = async (floor) => {
    const params = {
        IndexName: "floorIndex",
        TableName : "FloorObjects",
        KeyConditionExpression: "#floor = :value",
        ExpressionAttributeNames:{
            "#floor": "floor"
        },
        ExpressionAttributeValues: {
            ":value": floor
        }
    };
    const {Items, Count} = await accessDDb("query", params);
    logger.trace(`fetched ${Items.length} objects for floor ${floor}`);
    return Items;
}
