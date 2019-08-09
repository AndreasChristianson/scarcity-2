export const  handler = ({Records:{dynamodb, ...event}}, context, callback) =>
    console.log(dynamodb)