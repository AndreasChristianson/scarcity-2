import getObservers from '../util/connections';

export const handler = async ({Records}, context, callback) =>
    Records.forEach(({dynamodb:{OldImage, NewImage, SequenceNumber, Keys}, ...event}) => {
        const {objectId} = NewImage;
        const observers = await getObservers();
    });
