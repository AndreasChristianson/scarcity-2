import { postToConnection, getConnectionsByFloor } from '../util/connections';
import {processRecords} from '../util/ddb-stream';

const deleteObjectFromFloor = async (floor, id) => {
    const connections = await getConnectionsByFloor(floor);
    const promises = connections.map((ConnectionId) => postToConnection(
        ConnectionId,
        {
            criteria: {
                table: 'floorObjects',
                action: 'remove',
                id
            }
        }
    ));
    return Promise.all(promises);
}

const upsertObjectOnFloor = async (floor, object) => {
    const connections = await getConnectionsByFloor(floor);
    const promises = connections.map((ConnectionId) => postToConnection(
        ConnectionId,
        {
            criteria: {
                table: 'floorObjects',
                action: 'upsert',
                id: object.objectId
            },
            ...object
        }
    ));
    return Promise.all(promises);
}

export const handler = async ({ Records }, context, callback) =>
    processRecords(Records, async ({oldObject, newObject}) => {
        if (newObject && oldObject) {
            await upsertObjectOnFloor(newObject.floor, newObject)
            if (newObject.floor !== oldObject.floor) {
                await deleteObjectFromFloor(oldObject.floor, oldObject.objectId);
            }
        } else if (newObject) {
            await upsertObjectOnFloor(newObject.floor, newObject)
        } else {
            await deleteObjectFromFloor(oldObject.floor, oldObject.objectId);
        }
    });
