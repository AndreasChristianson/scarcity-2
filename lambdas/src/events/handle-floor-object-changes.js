import { getObjectsOnFloor } from '../util/floor-objects';
import { postToConnection } from '../util/connections';
import {processRecords} from '../util/ddb-stream';

const getConnectionsOnFloor = async (floor) => {
    const objects = await getObjectsOnFloor(floor);

    return objects
        .filter(({ ConnectionId }) => ConnectionId)
        .map(({ ConnectionId }) => ConnectionId);
};

const deleteObjectFromFloor = async (floor, id) => {
    const connections = await getConnectionsOnFloor(floor);
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
    const connections = await getConnectionsOnFloor(floor);
    const promises = connections.map((ConnectionId) => postToConnection(
        ConnectionId,
        {
            criteria: {
                table: 'floorObjects',
                action: 'upsert',
                id
            },
            ...object
        }
    ));
    return Promise.all(promises);
}

export const handler = async ({ Records }, context, callback) =>
    processRecords(Records, ({oldObject, newObject}) => {
        if (newObject && oldObject) {
            upsertObjectOnFloor(newObject.floor, newObject)
            if (newObject.floor !== oldObject.floor) {
                deleteObjectFromFloor(oldObject.floor, oldObject.objectId);
            }
        } else if (newObject) {
            upsertObjectOnFloor(newObject.floor, newObject)
        } else {
            deleteObjectFromFloor(oldObject.floor, oldObject.objectId);
        }
    });
