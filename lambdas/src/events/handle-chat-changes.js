import { postToConnection, getConnectionsByFloor} from '../util/connections';
import {processRecords} from '../util/ddb-stream';

const deleteChatMessage = async (chatObject) => {
    const connections = await getConnectionsByFloor(chatObject.floor);
    const promises = connections.map((ConnectionId) => postToConnection(
        ConnectionId,
        {
            criteria: {
                table: 'chat',
                action: 'remove',
                id: chatObject.chatId
            }
        }
    ));
    return Promise.all(promises);
}

const upsertChatMessage = async (chatObject) => {
    const connections = await getConnectionsByFloor(chatObject.floor);
    const promises = connections.map((ConnectionId) => postToConnection(
        ConnectionId,
        {
            criteria: {
                table: 'chat',
                action: 'upsert',
                id: chatObject.chatId
            },
            ...chatObject
        }
    ));
    return Promise.all(promises);
}

export const handler = async ({ Records }, context, callback) =>
    processRecords(Records, async ({oldObject, newObject}) => {
        if (newObject) {
            await upsertChatMessage(newObject)
        } else {
            await deleteChatMessage(oldObject);
        }
    });
