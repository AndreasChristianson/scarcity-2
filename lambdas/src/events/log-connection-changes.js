export const  handler = ({Records}, context, callback) =>
    Records.forEach(({dynamodb:{OldImage, NewImage, SequenceNumber, Keys}, ...event}) => console.log({OldImage, NewImage, event}))