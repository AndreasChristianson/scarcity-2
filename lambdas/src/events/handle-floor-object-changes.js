import { getObjectsOnFloor } from '../util/floor-objects';
import { postToConnection } from '../util/connections';

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
    Records.forEach(({ dynamodb: { OldImage, NewImage, SequenceNumber, Keys }, ...event }) => {
        if (NewImage && OldImage) {
            upsertObjectOnFloor(NewImage.floor, NewImage)
            if (NewImage.floor !== OldImage.floor) {
                deleteObjectFromFloor(OldImage.floor, OldImage.objectId);
            }
        } else if (NewImage) {
            upsertObjectOnFloor(NewImage.floor, NewImage)
        } else {
            deleteObjectFromFloor(OldImage.floor, OldImage.objectId);
        }
    });

