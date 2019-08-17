import AWS from 'aws-sdk';
const ddb = new AWS.DynamoDB.DocumentClient();
const dynamodbTranslator = ddb.getTranslator();
const ItemShape = ddb.service.api.operations.getItem.output.members.Item;

export const unmarshalTableItemImage = (image) => 
    dynamodbTranslator.translateOutput(image, ItemShape);

export const processRecords = (Records, processFunction) => 
    Records.map(({ dynamodb: { OldImage, NewImage, SequenceNumber, Keys }, ...event }) => {
        const oldObject = unmarshalTableItemImage(OldImage);
        const newObject = unmarshalTableItemImage(NewImage);
        return processFunction({oldObject, newObject, SequenceNumber, Keys, event});
    });
