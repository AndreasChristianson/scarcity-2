export const handler = async ({Records}, context, callback) =>
    Records.forEach(({dynamodb:{OldImage, NewImage, SequenceNumber, Keys}, ...event}) => {
        
        getConnectionsOnFloor()
    });
